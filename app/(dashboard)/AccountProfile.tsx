// AccountProfile.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    User as UserIcon,
    Building2,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Award,
    KeyRound,
    Bell,
    CheckCircle2,
    AlertCircle,
    Save,
    Sparkles,
    Lock,
    Smartphone,
    CreditCard,
    ThermometerSnowflake,
    Clock,
    Briefcase,
    Database,
    Fingerprint,
    Check,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

type UserRole = 'BUYER' | 'SUPPLIER' | 'PHARMACIST' | 'ADMIN';

type NotificationPreferences = {
    emailOrders: boolean;
    smsAlerts: boolean;
    coldChainExcursions: boolean;
    walletUpdates: boolean;
    weeklyDigest: boolean;
};

type ProfileFormData = {
    name: string;
    email: string;
    phone: string;
    emergencyContact: string;
    designation: string;
    organization: string;
    address: string;
    state: string;
    lga: string;
    facilityType: string;

    bedCapacity: number;
    receivingHours: string;
    backupPowerSpec: string;
    coldChainCapacityM3: number;
    licenseNumber: string;

    nafdacGdpLicense: string;
    pcnPremisesLicense: string;
    taxIdentificationNumber: string;
    settlementBankName: string;
    settlementAccountNumber: string;
    settlementAccountName: string;

    pharmacistLicense: string;
    annualPracticingLicenseNo: string;
    pharmacistCadre: string;

    adminClearanceTier: string;

    twoFactorEnabled: boolean;

    notificationPreferences: NotificationPreferences;
};

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
    emailOrders: true,
    smsAlerts: true,
    coldChainExcursions: true,
    walletUpdates: true,
    weeklyDigest: false,
};

const DEFAULT_FORM_DATA: ProfileFormData = {
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    designation: '',
    organization: '',
    address: '',
    state: 'Lagos State',
    lga: '',
    facilityType: '',

    bedCapacity: 850,
    receivingHours: '08:00 - 18:00 (Mon - Sat)',
    backupPowerSpec: '',
    coldChainCapacityM3: 120,
    licenseNumber: '',

    nafdacGdpLicense: 'NAFDAC/GDP/CERT/2024/481',
    pcnPremisesLicense: 'PCN/PREM/LAG/2024/099',
    taxIdentificationNumber: 'TIN-29104819-0001',
    settlementBankName: 'Zenith Bank Plc',
    settlementAccountNumber: '',
    settlementAccountName: '',

    pharmacistLicense: 'PCN-REG-2016-44912',
    annualPracticingLicenseNo: 'APL-2025-88391',
    pharmacistCadre:
        'Fellow, Pharmaceutical Society of Nigeria (FPSN)',

    adminClearanceTier: 'Tier 1 - Super Administrator',

    twoFactorEnabled: true,

    notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
};

const inputClass =
    'w-full px-3 py-2 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none transition';

const disabledInputClass =
    'w-full px-3 py-2 bg-slate-100 border border-[#E2E8F0] rounded-lg text-xs font-mono font-bold text-[#475569] cursor-not-allowed';

const labelClass =
    'block text-xs font-bold text-[#0F172A] mb-1';

const AccountProfile = () => {
    const { data: session } = useSession();

    const sessionUser = session?.user;

    const currentRole = (
        sessionUser?.role?.toUpperCase() || 'PHARMACIST'
    ) as UserRole;

    const currentUser = useMemo(() => {
        if (!sessionUser) return null;

        const name =
            [sessionUser.firstName, sessionUser.lastName]
                .filter(Boolean)
                .join(' ') ||
            sessionUser.name ||
            'User';

        return {
            id: sessionUser.id,
            name,
            email: sessionUser.email || '',
            organization:
                sessionUser.organization || 'Institutional Entity',
            supplierType: sessionUser.supplierType,
            createdAt: sessionUser.createdAt,
        };
    }, [sessionUser]);

    const [activeSubTab, setActiveSubTab] = useState('general');

    const [formData, setFormData] =
        useState<ProfileFormData>(DEFAULT_FORM_DATA);

    const [isSaving, setIsSaving] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    /**
     * Hydrate form from NextAuth session.
     */
    useEffect(() => {
        if (!sessionUser) return;

        const sessionName =
            [sessionUser.firstName, sessionUser.lastName]
                .filter(Boolean)
                .join(' ') ||
            sessionUser.name ||
            '';

        setFormData((previous) => ({
            ...previous,

            name: sessionName,
            email: sessionUser.email || '',
            organization:
                sessionUser.organization ||
                previous.organization ||
                'Institutional Entity',
        }));
    }, [sessionUser]);

    /**
     * Handle generic form field updates.
     */
    const handleInputChange = <K extends keyof ProfileFormData>(
        field: K,
        value: ProfileFormData[K],
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    /**
     * Simulated profile save.
     *
     * Replace the timeout with your real:
     * POST /api/profile/update
     */
    const handleSaveProfile = async (
        event?: React.FormEvent<HTMLFormElement>,
    ) => {
        event?.preventDefault();

        if (isSaving) return;

        setIsSaving(true);

        try {
            // Simulate API request.
            await new Promise((resolve) =>
                setTimeout(resolve, 1200),
            );

            console.log('MedSupply profile payload:', {
                userId: currentUser?.id,
                role: currentRole,
                ...formData,
            });

            toast.success('Profile updated successfully', {
                description:
                    'Your MedSupply account information has been synchronized.',
            });
        } catch {
            toast.error('Unable to save profile', {
                description:
                    'Something went wrong while updating your account.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Simulated password update.
     *
     * Replace with your real password API.
     */
    const handlePasswordSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!currentPassword) {
            toast.error('Current password is required');
            return;
        }

        if (!newPassword) {
            toast.error('New password is required');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Password is too short', {
                description:
                    'Your new password must contain at least 8 characters.',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match', {
                description:
                    'Confirm the new password and try again.',
            });
            return;
        }

        setIsChangingPassword(true);

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 1200),
            );

            toast.success('Password updated successfully', {
                description:
                    'Your new password is now active.',
            });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            toast.error('Password update failed');
        } finally {
            setIsChangingPassword(false);
        }
    };

    /**
     * Notification toggle.
     */
    const handleNotificationToggle = (
        key: keyof NotificationPreferences,
    ) => {
        setFormData((previous) => ({
            ...previous,
            notificationPreferences: {
                ...previous.notificationPreferences,
                [key]:
                    !previous.notificationPreferences[key],
            },
        }));
    };

    /**
     * Save notification preferences.
     */
    const handleSaveNotifications = async () => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 900),
            );

            console.log(
                'Notification preferences:',
                formData.notificationPreferences,
            );

            toast.success('Notification preferences saved', {
                description:
                    'Your alert subscriptions have been updated.',
            });
        } catch {
            toast.error('Unable to save notification preferences');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Simulated 2FA toggle.
     */
    const handleTwoFactorToggle = () => {
        const enabled = !formData.twoFactorEnabled;

        handleInputChange('twoFactorEnabled', enabled);

        toast.success(
            enabled
                ? 'Two-factor authentication enabled'
                : 'Two-factor authentication disabled',
            {
                description: enabled
                    ? 'Additional authentication is now required for protected actions.'
                    : 'Two-factor authentication has been disabled for this account.',
            },
        );
    };

    /**
     * Simulated session termination.
     */
    const handleTerminateSessions = async () => {
        toast.loading('Terminating other sessions...', {
            id: 'terminate-sessions',
        });

        await new Promise((resolve) =>
            setTimeout(resolve, 1000),
        );

        toast.success('Sessions terminated', {
            id: 'terminate-sessions',
            description:
                'All other browser sessions have been logged out.',
        });
    };

    const getRoleBadgeStyle = (role: UserRole) => {
        switch (role) {
            case 'BUYER':
                return 'bg-blue-50 text-[#2563EB] border-[#2563EB]/20';

            case 'SUPPLIER':
                return 'bg-amber-50 text-amber-700 border-amber-300';

            case 'PHARMACIST':
                return 'bg-emerald-50 text-[#16A34A] border-emerald-300';

            case 'ADMIN':
                return 'bg-purple-50 text-purple-700 border-purple-300';

            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const initials =
        currentUser?.name
            ?.split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((name) => name.charAt(0))
            .join('')
            .toUpperCase() || 'US';

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-200">

            {/* =========================================================
                PROFILE HEADER
            ========================================================== */}

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs relative overflow-hidden">

                <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-blue-50/60 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                    {/* Avatar + Identity */}
                    <div className="flex items-center gap-4">

                        <div className="relative group shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl font-bold font-mono shadow-md border-2 border-white">
                                {initials}
                            </div>

                            <div
                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#16A34A] border-2 border-white flex items-center justify-center text-white"
                                title="Active Verified Entity"
                            >
                                <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                        </div>

                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                                <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
                                    {currentUser?.name || 'User'}
                                </h1>

                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border uppercase tracking-wider ${getRoleBadgeStyle(
                                        currentRole,
                                    )}`}
                                >
                                    {currentRole}
                                </span>

                                {currentUser?.supplierType && (
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold capitalize">
                                        {currentUser.supplierType}
                                    </span>
                                )}

                            </div>

                            <p className="text-xs text-[#475569] font-medium mt-1 flex flex-wrap items-center gap-2">

                                <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />

                                <span>
                                    {currentUser?.organization ||
                                        'Institutional Entity'}
                                </span>

                                <span className="text-[#94A3B8]">•</span>

                                <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />

                                <span>
                                    {currentUser?.email || 'No email'}
                                </span>

                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">

                                <span className="inline-flex items-center gap-1 text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    NAFDAC & PCN Verified
                                </span>

                                <span className="text-[#94A3B8] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                                    User ID:{' '}
                                    <code className="font-mono text-[#0F172A]">
                                        {currentUser?.id || 'N/A'}
                                    </code>
                                </span>

                                <span className="text-[#94A3B8] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                                    Joined:{' '}
                                    {currentUser?.createdAt
                                        ? new Date(
                                            currentUser.createdAt,
                                        ).toLocaleDateString(
                                            'en-GB',
                                            {
                                                month: 'short',
                                                year: 'numeric',
                                            },
                                        )
                                        : '2024'}
                                </span>

                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">

                        {currentRole === 'BUYER' && (
                            <button
                                type="button"
                                onClick={() => {
                                    toast.info(
                                        'Wallet funding initiated',
                                        {
                                            description:
                                                'The wallet funding workflow is ready to connect to Paystack.',
                                        },
                                    );
                                }}
                                className="flex-1 md:flex-initial px-3.5 py-2 bg-[#16A34A] hover:bg-green-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Fund Wallet</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => handleSaveProfile()}
                            disabled={isSaving}
                            className="flex-1 md:flex-initial px-4 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>

                    </div>
                </div>

                {/* =====================================================
                    SHADCN TABS
                ====================================================== */}

                <Tabs
                    value={activeSubTab}
                    onValueChange={setActiveSubTab}
                    className="mt-7 pt-4 border-t border-[#E2E8F0]"
                >
                    <div className="w-full h-16 overflow-x-auto py-2 mb-1 scrollbar-thin">

                        <TabsList
                            className="    
                            gap-2"
                               >
                            <TabsTrigger
                                value="general"
                        className="
                        shrink-0
                        inline-flex items-center justify-center gap-2
                        min-h-10
                        px-4 py-2.5
                        rounded-lg
                        border border-[#E2E8F0]
                        bg-white
                        text-[#475569]
                        text-xs font-bold
                        whitespace-nowrap
                        shadow-sm
                        transition-all duration-200

                        hover:bg-slate-50
                        hover:border-[#CBD5E1]
                        hover:text-[#0F172A]

                        data-[state=active]:
                        bg-[#2563EB]
                        data-[state=active]:
                        text-white
                        data-[state=active]:
                        border-[#2563EB]
                        data-[state=active]:
                        shadow-md
                        "
                            >
                        <UserIcon className="w-4 h-4 shrink-0" />
                        <span>Identity & Organization</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="compliance"
                        className="
            shrink-0
            inline-flex items-center justify-center gap-2
            min-h-10
            px-4 py-2.5
            rounded-lg
            border border-[#E2E8F0]
            bg-white
            text-[#475569]
            text-xs font-bold
            whitespace-nowrap
            shadow-sm
            transition-all duration-200

            hover:bg-slate-50
            hover:border-[#CBD5E1]
            hover:text-[#0F172A]

            data-[state=active]:
                bg-[#2563EB]
            data-[state=active]:
                text-white
            data-[state=active]:
                border-[#2563EB]
            data-[state=active]:
                shadow-md
        "
                    >
                        <Award className="w-4 h-4 shrink-0" />

                        <span>
                            {currentRole === 'BUYER' &&
                                'Hospital Facility & Receiving'}

                            {currentRole === 'SUPPLIER' &&
                                'NAFDAC GDP & Settlement'}

                            {currentRole === 'PHARMACIST' &&
                                'PCN Cadre & QA Station'}

                            {currentRole === 'ADMIN' &&
                                'Platform Governance & Policies'}
                        </span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="security"
                        className="
            shrink-0
            inline-flex items-center justify-center gap-2
            min-h-10
            px-4 py-2.5
            rounded-lg
            border border-[#E2E8F0]
            bg-white
            text-[#475569]
            text-xs font-bold
            whitespace-nowrap
            shadow-sm
            transition-all duration-200

            hover:bg-slate-50
            hover:border-[#CBD5E1]
            hover:text-[#0F172A]

            data-[state=active]:
                bg-[#2563EB]
            data-[state=active]:
                text-white
            data-[state=active]:
                border-[#2563EB]
            data-[state=active]:
                shadow-md
        "
                    >
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>Security & Authentication</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="notifications"
                        className="
            shrink-0
            inline-flex items-center justify-center gap-2
            min-h-10
            px-4 py-2.5
            rounded-lg
            border border-[#E2E8F0]
            bg-white
            text-[#475569]
            text-xs font-bold
            whitespace-nowrap
            shadow-sm
            transition-all duration-200

            hover:bg-slate-50
            hover:border-[#CBD5E1]
            hover:text-[#0F172A]

            data-[state=active]:
                bg-[#2563EB]
            data-[state=active]:
                text-white
            data-[state=active]:
                border-[#2563EB]
            data-[state=active]:
                shadow-md
        "
                    >
                        <Bell className="w-4 h-4 shrink-0" />
                        <span>Alerts & Notifications</span>
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* =================================================
                        TAB: GENERAL
                    ================================================== */}

            <TabsContent
                value="general"
                className="mt-6 focus-visible:outline-none"
            >
                <form
                    onSubmit={handleSaveProfile}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Personal Contact */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                            <div className="border-b border-[#E2E8F0] pb-3">
                                <h2 className="text-sm font-bold text-[#0F172A]">
                                    Primary Contact & Designation
                                </h2>

                                <p className="text-xs text-[#475569]">
                                    Official authorized representative
                                    for procurement contracts,
                                    dispatch sign-offs, and
                                    compliance queries.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Name */}
                                <div>
                                    <label className={labelClass}>
                                        Full Legal Name
                                    </label>

                                    <div className="relative">
                                        <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />

                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${inputClass} pl-9`}
                                            placeholder="e.g. Dr. Tunde Fashola"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Designation */}
                                <div>
                                    <label className={labelClass}>
                                        Designation / Clinical Title
                                    </label>

                                    <div className="relative">
                                        <Briefcase className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />

                                        <input
                                            type="text"
                                            value={
                                                formData.designation
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'designation',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${inputClass} pl-9`}
                                            placeholder="e.g. Director of Pharmaceutical Services"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={labelClass}>
                                        Official Email Address
                                    </label>

                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />

                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${inputClass} pl-9`}
                                            placeholder="e.g. procurement@institution.gov.ng"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className={labelClass}>
                                        Primary Phone (SMS & Voice)
                                    </label>

                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />

                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'phone',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${inputClass} pl-9`}
                                            placeholder="+234 800 000 0000"
                                        />
                                    </div>
                                </div>

                                {/* Emergency */}
                                <div>
                                    <label className={labelClass}>
                                        Secondary Emergency Hotline
                                    </label>

                                    <div className="relative">
                                        <Smartphone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />

                                        <input
                                            type="tel"
                                            value={
                                                formData.emergencyContact
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'emergencyContact',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${inputClass} pl-9`}
                                            placeholder="+234 802 334 9911"
                                        />
                                    </div>
                                </div>

                                {/* Role */}
                                <div>
                                    <label className={labelClass}>
                                        Institutional Role Scope
                                    </label>

                                    <input
                                        type="text"
                                        disabled
                                        value={`${currentRole} (${currentUser?.organization ||
                                            'Enterprise'
                                            })`}
                                        className={disabledInputClass}
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="border-t border-[#E2E8F0] pt-4 space-y-4">

                                <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                                    Facility Location & Dispatch
                                    Address
                                </h3>

                                <div>
                                    <label className={labelClass}>
                                        Street Address & Receiving Gate
                                    </label>

                                    <textarea
                                        rows={2}
                                        value={formData.address}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'address',
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClass} resize-none`}
                                        placeholder="e.g. Idi-Araba, Surulere, Main Clinical Receiving Bay 2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div>
                                        <label className={labelClass}>
                                            State
                                        </label>

                                        <select
                                            value={formData.state}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'state',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            <option>
                                                Lagos State
                                            </option>
                                            <option>
                                                Federal Capital Territory
                                                (Abuja)
                                            </option>
                                            <option>
                                                Ogun State
                                            </option>
                                            <option>
                                                Oyo State
                                            </option>
                                            <option>
                                                Rivers State
                                            </option>
                                            <option>
                                                Kano State
                                            </option>
                                            <option>
                                                Enugu State
                                            </option>
                                            <option>
                                                Delta State
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            LGA / Zone
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.lga}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'lga',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="e.g. Surulere / Ikeja Industrial Zone"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Enterprise */}
                        <div className="space-y-6">

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">

                                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">

                                    <h3 className="text-xs font-bold text-[#0F172A]">
                                        Enterprise Profile
                                    </h3>

                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Active
                                    </span>

                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Organization / Facility Legal
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            formData.organization
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'organization',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="e.g. Lagos University Teaching Hospital"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Facility Classification
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            formData.facilityType
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'facilityType',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="e.g. Federal Tertiary Teaching Hospital"
                                    />
                                </div>

                                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2 text-xs">

                                    <div className="flex justify-between">
                                        <span className="text-[#94A3B8]">
                                            Audit Status:
                                        </span>

                                        <span className="font-bold text-[#16A34A]">
                                            GDP Compliant
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[#94A3B8]">
                                            Procurement Tier:
                                        </span>

                                        <span className="font-bold text-[#0F172A]">
                                            Institutional Level 1
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[#94A3B8]">
                                            NAFDAC Clearance:
                                        </span>

                                        <span className="font-bold text-[#2563EB]">
                                            Verified 2025
                                        </span>
                                    </div>

                                </div>
                            </div>

                            {/* Save Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 text-xs text-[#0F172A] space-y-3">

                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#2563EB]" />

                                    <span className="font-bold">
                                        Real-time Synchronization
                                    </span>
                                </div>

                                <p className="text-[#475569] text-[11.5px] leading-relaxed">
                                    Profile changes are prepared for
                                    synchronization with the MedSupply
                                    account service and audit trail.
                                </p>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Update Profile Information
                                        </>
                                    )}
                                </button>

                            </div>
                        </div>
                    </div>
                </form>
            </TabsContent>

            {/* =================================================
                        TAB: COMPLIANCE
                    ================================================== */}

            <TabsContent
                value="compliance"
                className="mt-6 focus-visible:outline-none"
            >
                <form
                    onSubmit={handleSaveProfile}
                    className="space-y-6"
                >

                    {/* BUYER */}
                    {currentRole === 'BUYER' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            Hospital Capacity & Dock
                                            Logistics
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            Clinical specifications for
                                            pharmaceutical drops and
                                            fleet routing.
                                        </p>
                                    </div>

                                    <Building2 className="w-5 h-5 text-[#2563EB]" />
                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className={labelClass}>
                                            Inpatient Bed Capacity
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                formData.bedCapacity
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'bedCapacity',
                                                    parseInt(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Receiving Dock Operating
                                            Hours
                                        </label>

                                        <div className="relative">
                                            <Clock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />

                                            <input
                                                type="text"
                                                value={
                                                    formData.receivingHours
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'receivingHours',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} pl-9`}
                                                placeholder="e.g. 08:00 - 18:00 (Mon - Sat)"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Emergency Backup Power Spec
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.backupPowerSpec
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'backupPowerSpec',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="e.g. Dual 500kVA Generators with 24/7 ATS"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            Cold-Chain Receiving
                                            Infrastructure
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            Temperature-controlled
                                            pharmaceutical receiving
                                            configuration.
                                        </p>
                                    </div>

                                    <ThermometerSnowflake className="w-5 h-5 text-sky-600" />
                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className={labelClass}>
                                            Cold Room Storage Capacity
                                            (m³)
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                formData.coldChainCapacityM3
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'coldChainCapacityM3',
                                                    parseInt(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="p-3.5 bg-sky-50 rounded-lg border border-sky-200 text-xs text-sky-900 space-y-2">

                                        <div className="font-bold flex items-center gap-1.5">
                                            <ShieldCheck className="w-4 h-4 text-sky-600" />
                                            <span>
                                                Continuous Temperature
                                                Monitoring
                                            </span>
                                        </div>

                                        <p className="text-sky-700 text-[11.5px] leading-relaxed">
                                            Configure the facility for
                                            automated cold-chain
                                            monitoring and temperature
                                            excursion alerts.
                                        </p>

                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Hospital Regulatory
                                            Registration Number
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.licenseNumber
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'licenseNumber',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="e.g. MoH-LAG-HOSP-2023-0194"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUPPLIER */}
                    {currentRole === 'SUPPLIER' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            Regulatory Licenses & GDP
                                            Certification
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            NAFDAC and PCN verified
                                            statutory manufacturing and
                                            distribution permits.
                                        </p>
                                    </div>

                                    <Award className="w-5 h-5 text-amber-600" />
                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className={labelClass}>
                                            NAFDAC GDP License No
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.nafdacGdpLicense
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'nafdacGdpLicense',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            PCN Premises Registration
                                            License No
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.pcnPremisesLicense
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'pcnPremisesLicense',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">

                                        <div>
                                            <label className={labelClass}>
                                                Warehouse Capacity (m³)
                                            </label>

                                            <input
                                                type="number"
                                                value={
                                                    formData.coldChainCapacityM3
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'coldChainCapacityM3',
                                                        parseInt(
                                                            e.target
                                                                .value,
                                                        ) || 0,
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Corporate Tax ID (TIN)
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    formData.taxIdentificationNumber
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'taxIdentificationNumber',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Settlement */}
                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            Settlement & Paystack
                                            Escrow Account
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            Automated settlement
                                            configuration for verified
                                            completed order batches.
                                        </p>
                                    </div>

                                    <CreditCard className="w-5 h-5 text-[#16A34A]" />
                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className={labelClass}>
                                            Settlement Bank
                                        </label>

                                        <select
                                            value={
                                                formData.settlementBankName
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'settlementBankName',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            <option>
                                                Zenith Bank Plc
                                            </option>
                                            <option>
                                                Access Bank Plc
                                            </option>
                                            <option>
                                                Guaranty Trust Bank
                                                (GTBank)
                                            </option>
                                            <option>
                                                First Bank of Nigeria
                                            </option>
                                            <option>
                                                United Bank for Africa
                                                (UBA)
                                            </option>
                                            <option>
                                                Stanbic IBTC Bank
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            10-Digit NUBAN Account
                                            Number
                                        </label>

                                        <input
                                            type="text"
                                            maxLength={10}
                                            inputMode="numeric"
                                            value={
                                                formData.settlementAccountNumber
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'settlementAccountNumber',
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            className={`${inputClass} font-mono font-bold`}
                                            placeholder="1014892019"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Account Beneficiary Name
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.settlementAccountName ||
                                                formData.organization
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'settlementAccountName',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">

                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />

                                            <span className="font-bold text-[#16A34A]">
                                                Direct Settlement Active
                                            </span>
                                        </div>

                                        <span className="text-[11px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                                            T+1
                                        </span>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* PHARMACIST */}
                    {currentRole === 'PHARMACIST' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            PCN Credentials & Cadre
                                            Standing
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            Professional license
                                            credentials for batch QA
                                            release.
                                        </p>
                                    </div>

                                    <Award className="w-5 h-5 text-emerald-600" />
                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className={labelClass}>
                                            PCN Superintendent
                                            Pharmacist Reg No
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.pharmacistLicense
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'pharmacistLicense',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${inputClass} font-mono font-bold`}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Annual Practicing License
                                            Serial
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.annualPracticingLicenseNo
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'annualPracticingLicenseNo',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${inputClass} font-mono font-bold`}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Professional Cadre &
                                            Fellowship
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formData.pharmacistCadre
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'pharmacistCadre',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            Digital QA Stamp &
                                            Verification Station
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            Digital signing identity
                                            used on inspection approval
                                            sheets.
                                        </p>
                                    </div>

                                    <Fingerprint className="w-5 h-5 text-[#2563EB]" />
                                </div>

                                <div className="space-y-4">

                                    <div className="p-4 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-3">

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs font-bold text-[#0F172A]">
                                                QA Digital Seal Token
                                            </span>

                                            <span className="text-[10px] font-mono text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                ACTIVE
                                            </span>
                                        </div>

                                        <div className="font-mono text-[11px] text-[#475569] bg-white p-2.5 rounded border border-[#E2E8F0] truncate">
                                            SHA256:
                                            8a4f91e03c2b8104d5578a1f8103c80a2b91c...
                                        </div>

                                        <p className="text-[11px] text-[#475569]">
                                            Automatically appended to
                                            Batch Release Certificates
                                            generated for verified
                                            hospital procurements.
                                        </p>

                                    </div>

                                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />

                                        <span>
                                            Authorized for Quarantine
                                            Invalidation & Lot Rejection
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* ADMIN */}
                    {currentRole === 'ADMIN' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            Governance Tier & System
                                            Authority
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            Platform operational
                                            controls and emergency
                                            safeguards.
                                        </p>
                                    </div>

                                    <ShieldCheck className="w-5 h-5 text-purple-600" />

                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className={labelClass}>
                                            Clearance Level
                                        </label>

                                        <input
                                            type="text"
                                            disabled
                                            value={
                                                formData.adminClearanceTier
                                            }
                                            className="w-full px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-xs font-bold text-purple-900"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Regulatory Reporting Target
                                        </label>

                                        <input
                                            type="text"
                                            disabled
                                            value="Federal Ministry of Health & NAFDAC Regulatory Liaison Bureau"
                                            className={disabledInputClass}
                                        />
                                    </div>

                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">

                                        <div className="font-bold flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4 text-amber-600" />
                                            Circuit Breaker Authority
                                        </div>

                                        <p className="text-amber-800 text-[11px]">
                                            Administrator permissions
                                            include protected platform
                                            controls such as account
                                            freezes and supplier batch
                                            quarantine.
                                        </p>

                                    </div>

                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                                <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                    <div>
                                        <h2 className="text-sm font-bold text-[#0F172A]">
                                            Master System Endpoints
                                        </h2>

                                        <p className="text-xs text-[#475569]">
                                            Active service
                                            interconnections.
                                        </p>
                                    </div>

                                    <Database className="w-5 h-5 text-[#2563EB]" />

                                </div>

                                <div className="space-y-3 text-xs">

                                    {[
                                        [
                                            'Paystack Escrow Webhook',
                                            'https://api.medisupply.ng/webhooks/paystack',
                                            'LIVE 200 OK',
                                        ],
                                        [
                                            'Cold-Chain Telemetry Ingestion',
                                            'mqtts://iot.medisupply.ng:8883/excursions',
                                            'STREAMING',
                                        ],
                                        [
                                            'NAFDAC Database Lookup API',
                                            'https://greenbook.nafdac.gov.ng/api/v2/verify',
                                            'SYNCED',
                                        ],
                                    ].map(
                                        (
                                            [title, endpoint, status],
                                            index,
                                        ) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-slate-50 rounded-lg border border-[#E2E8F0] flex justify-between items-center gap-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[#0F172A]">
                                                        {title}
                                                    </p>

                                                    <p className="text-[11px] text-[#94A3B8] font-mono truncate">
                                                        {endpoint}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                    {status}
                                                </span>
                                            </div>
                                        ),
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Compliance Configuration
                                </>
                            )}
                        </button>

                    </div>
                </form>
            </TabsContent>

            {/* =================================================
                        TAB: SECURITY
                    ================================================== */}

            <TabsContent
                value="security"
                className="mt-6 focus-visible:outline-none"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Password */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">

                        <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                            <div>
                                <h2 className="text-sm font-bold text-[#0F172A]">
                                    Change Portal Password
                                </h2>

                                <p className="text-xs text-[#475569]">
                                    Update your institutional login
                                    credentials.
                                </p>
                            </div>

                            <KeyRound className="w-5 h-5 text-[#2563EB]" />

                        </div>

                        <form
                            onSubmit={handlePasswordSubmit}
                            className="space-y-4"
                        >

                            <div>
                                <label className={labelClass}>
                                    Current Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="••••••••••••"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous,
                                            )
                                        }
                                        className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>

                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    New Password
                                </label>

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="At least 8 characters"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Confirm New Password
                                </label>

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="Re-type new password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Updating Password...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-3.5 h-3.5" />
                                        Update Password
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                    {/* 2FA + Sessions */}
                    <div className="space-y-6">

                        {/* 2FA */}
                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">

                            <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">

                                <div>
                                    <h2 className="text-sm font-bold text-[#0F172A]">
                                        Two-Factor Authentication
                                        (2FA)
                                    </h2>

                                    <p className="text-xs text-[#475569]">
                                        Additional protection for
                                        financial approvals and
                                        dispatch releases.
                                    </p>
                                </div>

                                <Smartphone className="w-5 h-5 text-[#16A34A]" />

                            </div>

                            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-[#E2E8F0]">

                                <div className="flex items-center gap-3">

                                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-[#0F172A]">
                                            SMS & TOTP Authenticator
                                        </p>

                                        <p className="text-[11px] text-[#475569]">
                                            Protected authentication
                                            method
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleTwoFactorToggle
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${formData.twoFactorEnabled
                                        ? 'bg-emerald-100 text-[#16A34A]'
                                        : 'bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    {formData.twoFactorEnabled
                                        ? 'ENABLED'
                                        : 'DISABLED'}
                                </button>

                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">

                            <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between gap-4">

                                <h3 className="text-xs font-bold text-[#0F172A]">
                                    Active Login Sessions
                                </h3>

                                <button
                                    type="button"
                                    onClick={
                                        handleTerminateSessions
                                    }
                                    className="text-[11px] font-bold text-[#DC2626] hover:underline cursor-pointer whitespace-nowrap"
                                >
                                    Terminate Other Sessions
                                </button>

                            </div>

                            <div className="space-y-2 text-xs">

                                <div className="p-3 bg-slate-50 rounded-lg border border-[#E2E8F0] flex items-center justify-between gap-3">

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />

                                            <span className="font-bold text-[#0F172A]">
                                                Current Browser
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-[#94A3B8] mt-0.5">
                                            Current active session
                                        </p>
                                    </div>

                                    <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                                        THIS DEVICE
                                    </span>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            {/* =================================================
                        TAB: NOTIFICATIONS
                    ================================================== */}

            <TabsContent
                value="notifications"
                className="mt-6 focus-visible:outline-none"
            >
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">

                    <div className="border-b border-[#E2E8F0] pb-3">

                        <h2 className="text-sm font-bold text-[#0F172A]">
                            Notification & Telemetry Subscriptions
                        </h2>

                        <p className="text-xs text-[#475569]">
                            Configure automated channels for order
                            transitions, temperature excursions, and
                            financial settlements.
                        </p>

                    </div>

                    <div className="space-y-4 divide-y divide-slate-100">

                        {/* Orders */}
                        <NotificationToggle
                            title="Order & Sourcing Status Notifications"
                            description="Receive real-time alerts when tenders are matched, confirmed, or dispatched."
                            enabled={
                                formData
                                    .notificationPreferences
                                    .emailOrders
                            }
                            onToggle={() =>
                                handleNotificationToggle(
                                    'emailOrders',
                                )
                            }
                        />

                        {/* SMS */}
                        <NotificationToggle
                            title="Instant High-Priority SMS Alerts"
                            description="Send critical dispatch and delivery PIN codes to the primary mobile number."
                            enabled={
                                formData
                                    .notificationPreferences
                                    .smsAlerts
                            }
                            onToggle={() =>
                                handleNotificationToggle(
                                    'smsAlerts',
                                )
                            }
                        />

                        {/* Cold chain */}
                        <NotificationToggle
                            title="Cold-Chain Temperature Excursion Siren"
                            description="Immediate alarm whenever monitored temperature exceeds configured thresholds."
                            enabled={
                                formData
                                    .notificationPreferences
                                    .coldChainExcursions
                            }
                            color="green"
                            onToggle={() =>
                                handleNotificationToggle(
                                    'coldChainExcursions',
                                )
                            }
                        />

                        {/* Wallet */}
                        <NotificationToggle
                            title="Financial & Paystack Escrow Updates"
                            description="Disbursement receipts, invoices, and wallet transaction updates."
                            enabled={
                                formData
                                    .notificationPreferences
                                    .walletUpdates
                            }
                            onToggle={() =>
                                handleNotificationToggle(
                                    'walletUpdates',
                                )
                            }
                        />

                        {/* Digest */}
                        <NotificationToggle
                            title="Weekly Executive Procurement Digest"
                            description="Comprehensive breakdown of fulfillment rates, savings, and compliance audits."
                            enabled={
                                formData
                                    .notificationPreferences
                                    .weeklyDigest
                            }
                            onToggle={() =>
                                handleNotificationToggle(
                                    'weeklyDigest',
                                )
                            }
                        />

                    </div>

                    <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">

                        <button
                            type="button"
                            onClick={
                                handleSaveNotifications
                            }
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Alert Preferences
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </TabsContent>
        </Tabs>
            </div >
        </div >
    );
};

/* ================================================================
   NOTIFICATION TOGGLE COMPONENT
================================================================ */

type NotificationToggleProps = {
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    color?: 'blue' | 'green';
};

const NotificationToggle = ({
    title,
    description,
    enabled,
    onToggle,
    color = 'blue',
}: NotificationToggleProps) => {
    const activeColor =
        color === 'green' ? 'bg-[#16A34A]' : 'bg-[#2563EB]';

    return (
        <div className="pt-3 first:pt-0 flex items-center justify-between gap-6">

            <div className="min-w-0">
                <p className="text-xs font-bold text-[#0F172A]">
                    {title}
                </p>

                <p className="text-[11px] text-[#475569] mt-0.5">
                    {description}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`Toggle ${title}`}
                onClick={onToggle}
                className={`shrink-0 w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 ${enabled
                    ? activeColor
                    : 'bg-slate-300'
                    }`}
            >
                <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${enabled
                        ? 'translate-x-6'
                        : 'translate-x-0'
                        }`}
                />
            </button>

        </div>
    );
};

export default AccountProfile;