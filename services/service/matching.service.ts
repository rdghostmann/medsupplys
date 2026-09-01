import { db } from '../db';
import { SupplierScoreBreakdown, SupplierType } from '../../types';

export class SupplierMatchingService {
  /**
   * Evaluates all suppliers for a given product and quantity,
   * calculating a multi-factor matching score.
   */
  public matchSuppliers(productId: string, requestedQuantity: number): SupplierScoreBreakdown[] {
    const matchingWeights = db.config.matchingWeights;
    
    // Find all supplier inventory listings for this product that are APPROVED
    const inventoryListings = db.supplierProducts.filter((sp) => {
      const sup = db.users.find((u) => u.id === sp.supplierId);
      return (
        sp.productId === productId &&
        sp.status !== 'SUSPENDED' &&
        sp.status !== 'EXPIRED' &&
        sup &&
        sup.supplierApprovalStatus === 'APPROVED'
      );
    });

    if (inventoryListings.length === 0) {
      return [];
    }

    // Find the minimum base price across all suppliers for relative price scoring
    const minPrice = Math.min(...inventoryListings.map((sp) => sp.finalPrice));

    const scoredSuppliers: SupplierScoreBreakdown[] = inventoryListings.map((sp) => {
      const sup = db.users.find((u) => u.id === sp.supplierId)!;
      let isEligible = true;
      let ineligibilityReason: string | undefined = undefined;

      // 1. Availability check & scoring (Max: availabilityWeight, default 25)
      let availabilityScore = 0;
      if (sp.stock < requestedQuantity) {
        if (sp.stock === 0) {
          isEligible = false;
          ineligibilityReason = 'Out of Stock';
        } else {
          // Partial availability
          availabilityScore = (sp.stock / requestedQuantity) * (matchingWeights.availabilityWeight * 0.5);
        }
      } else {
        // Full stock available
        const bufferRatio = Math.min(sp.stock / requestedQuantity, 3);
        availabilityScore = matchingWeights.availabilityWeight * (0.8 + 0.2 * (bufferRatio / 3));
      }

      // Check MOQ
      if (requestedQuantity < sp.minOrderQuantity) {
        isEligible = false;
        ineligibilityReason = `Order quantity (${requestedQuantity}) is below Supplier MOQ (${sp.minOrderQuantity})`;
      }

      // 2. Price competitiveness score (Max: priceWeight, default 35)
      // Lower price gets higher score: (minPrice / thisPrice) * priceWeight
      const priceRatio = minPrice / sp.finalPrice;
      const priceScore = matchingWeights.priceWeight * Math.pow(priceRatio, 1.2);

      // 3. Supplier Type Hierarchy (Max: supplierTypeWeight, default 20)
      // Importers receive maximum volume & tier points, Distributors middle, Retailers baseline
      let typeScoreRatio = 0.4;
      if (sp.supplierType === 'IMPORTER') {
        typeScoreRatio = 1.0; // 100% of supplier type weight
      } else if (sp.supplierType === 'DISTRIBUTOR') {
        typeScoreRatio = 0.7; // 70% of supplier type weight
      } else if (sp.supplierType === 'RETAILER') {
        typeScoreRatio = 0.4; // 40% of supplier type weight
      }
      const supplierTypeScore = matchingWeights.supplierTypeWeight * typeScoreRatio;

      // 4. Historical fulfillment rate score (Max: fulfillmentWeight, default 10)
      const fulfillmentScore = matchingWeights.fulfillmentWeight * ((sp.fulfillmentRate || 95) / 100);

      // 5. Reliability & Quality Rating score (Max: reliabilityWeight, default 10)
      const reliabilityScore = matchingWeights.reliabilityWeight * ((sp.rating || 4.5) / 5.0);

      const totalScore = Number(
        (availabilityScore + priceScore + supplierTypeScore + fulfillmentScore + reliabilityScore).toFixed(1)
      );

      return {
        supplierId: sp.supplierId,
        supplierName: sp.supplierName,
        supplierType: sp.supplierType,
        basePrice: sp.basePrice,
        finalPrice: sp.finalPrice,
        stock: sp.stock,
        moq: sp.minOrderQuantity,
        rating: sp.rating,
        fulfillmentRate: sp.fulfillmentRate,
        deliveryDays: sp.estimatedDeliveryDays,
        availabilityScore: Number(availabilityScore.toFixed(1)),
        priceScore: Number(priceScore.toFixed(1)),
        supplierTypeScore: Number(supplierTypeScore.toFixed(1)),
        fulfillmentScore: Number(fulfillmentScore.toFixed(1)),
        reliabilityScore: Number(reliabilityScore.toFixed(1)),
        totalScore,
        isEligible,
        ineligibilityReason,
      };
    });

    // Sort: Eligible first, then highest total score descending
    return scoredSuppliers.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.totalScore - a.totalScore;
    });
  }
}

export const supplierMatchingService = new SupplierMatchingService();
