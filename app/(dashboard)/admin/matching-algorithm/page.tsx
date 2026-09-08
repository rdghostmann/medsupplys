import MatchingAlgorithmPage from "./MatchingAlgorithmPage";
import { getMatchingWeights } from "@/controllers/platform-config.controller";

export default async function Page() {
  const matchingWeights =
    await getMatchingWeights();

  return (
    <MatchingAlgorithmPage
      matchingWeights={matchingWeights}
    />
  );
}