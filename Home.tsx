import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, Camera } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getTranslation } from "@/lib/translations-full";
import PaymentCheckout from "@/components/PaymentCheckout";

export default function Home() {
  const { language } = useLanguage();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [step, setStep] = useState<"upload" | "questionnaire" | "payment">("upload");
  const [showPayment, setShowPayment] = useState(false);
  const [referralCode, setReferralCode] = useState<string | undefined>();

  // Questionnaire state
  const [skinType, setSkinType] = useState("");
  const [concern, setConcern] = useState("");
  const [recentTreatments, setRecentTreatments] = useState("");
  const [treatmentDetails, setTreatmentDetails] = useState("");
  const [routineLevel, setRoutineLevel] = useState("");
  const [sunscreenUsage, setSunscreenUsage] = useState("");
  const t = (key: any) => getTranslation(language, key);

  const analyzeMutation = trpc.analysis.analyze.useMutation({
    onSuccess: (data) => {
      setLocation(`/result/${data.id}`);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (imageFile) {
      setStep("questionnaire");
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) return;

    // Check if payment is required
    if ((language === "ar" || language === "en") && !referralCode) {
      setShowPayment(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      analyzeMutation.mutate({
        imageData: base64,
        language,
        referralCode,
        userContext: {
          skinTypeSelfReported: skinType,
          concern,
          recentTreatments: recentTreatments === "yes" ? treatmentDetails : (language === "ar" ? "لا" : "No"),
          routineLevel,
          sunscreenUsage,
        },
      });
    };
    reader.readAsDataURL(imageFile);
  };

  const handlePaymentSuccess = (code?: string) => {
    setReferralCode(code);
    setShowPayment(false);
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        analyzeMutation.mutate({
          imageData: base64,
          language,
          referralCode: code,
          userContext: {
            skinTypeSelfReported: skinType,
            concern,
            recentTreatments: recentTreatments === "yes" ? treatmentDetails : (language === "ar" ? "لا" : "No"),
            routineLevel,
            sunscreenUsage,
          },
        });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const isQuestionnaireComplete = useMemo(() => {
    return skinType && concern && recentTreatments && routineLevel && sunscreenUsage;
  }, [skinType, concern, recentTreatments, routineLevel, sunscreenUsage]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/drpal-hero.png" alt="Dr.PAL" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
          <LanguageSelector />
          {isAuthenticated && (
            <div className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-4xl">
        {step === "upload" ? (
          <>
            {/* Introduction Video */}
            <Card className="shadow-lg mb-8 overflow-hidden">
              <CardContent className="p-0">
                <video
                  width="100%"
                  height="auto"
                  controls
                  className="w-full"
                  poster="/drpal-hero.png"
                >
                  <source src="/intro-video.mp4" type="video/mp4" />
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند
                </video>
              </CardContent>
            </Card>

            {/* Upload Card */}
            <Card className="shadow-lg border-2">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl mb-2">{t("uploadPhoto")}</CardTitle>
                <CardDescription>
                  {t("uploadDescription")}
                </CardDescription>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg border-2 border-border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 left-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                    >
                      حذف
                    </Button>
                  </div>
                ) : (
                  <label className="w-full max-w-md cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">{t('clickOrDragUpload')}</p>
                      <p className="text-sm text-muted-foreground">{t('fileSizeInfo')}</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {imageFile && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContinue}
                >
                  {t('continueToQuestionnaire')}
                </Button>
              )}
            </CardContent>
          </Card>
          </>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t('questionnaire')}</CardTitle>
              <CardDescription className="text-base">
                {t('questionnaireDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question 1: Skin Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("skinTypeQuestion")}</Label>
                <RadioGroup value={skinType} onValueChange={setSkinType}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="dry" id="dry" />
                    <Label htmlFor="dry" className="cursor-pointer">{t("skinTypeDry")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="oily" id="oily" />
                    <Label htmlFor="oily" className="cursor-pointer">{t("skinTypeOily")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="combination" id="combination" />
                    <Label htmlFor="combination" className="cursor-pointer">{t("skinTypeCombination")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="cursor-pointer">{t("skinTypeNormal")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="unknown" id="unknown" />
                    <Label htmlFor="unknown" className="cursor-pointer">{t('notSure')}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 2: Concern */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("concernQuestion")}</Label>
                <RadioGroup value={concern} onValueChange={setConcern}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="wrinkles" id="wrinkles" />
                    <Label htmlFor="wrinkles" className="cursor-pointer">{t("concernWrinkles")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="acne" id="acne" />
                    <Label htmlFor="acne" className="cursor-pointer">{t("concernAcne")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="pigmentation" id="pigmentation" />
                    <Label htmlFor="pigmentation" className="cursor-pointer">{t("concernPigmentation")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="texture" id="texture" />
                    <Label htmlFor="texture" className="cursor-pointer">{t("concernTexture")}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 3: Recent Treatments */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("treatmentQuestion")}</Label>
                <RadioGroup value={recentTreatments} onValueChange={setRecentTreatments}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="cursor-pointer">{t("treatmentYes")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="cursor-pointer">{t("treatmentNo")}</Label>
                  </div>
                </RadioGroup>
                {recentTreatments === "yes" && (
                    <Textarea
                      placeholder={t('treatmentDetails')}
                      value={treatmentDetails}
                      onChange={(e) => setTreatmentDetails(e.target.value)}
                      className="min-h-20"
                    />
                )}
              </div>

              {/* Question 4: Routine Level */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("routineQuestion")}</Label>
                <RadioGroup value={routineLevel} onValueChange={setRoutineLevel}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="wash_only" id="wash_only" />
                    <Label htmlFor="wash_only" className="cursor-pointer">{t("routineMinimal")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="wash_moisturizer" id="wash_moisturizer" />
                    <Label htmlFor="wash_moisturizer" className="cursor-pointer">{t("routineModerate")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="full_routine" id="full_routine" />
                    <Label htmlFor="full_routine" className="cursor-pointer">{t("routineExtensive")}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 5: Sunscreen Usage */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("sunscreenQuestion")}</Label>
                <RadioGroup value={sunscreenUsage} onValueChange={setSunscreenUsage}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="cursor-pointer">{t("sunscreenDaily")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="sometimes" id="sometimes" />
                    <Label htmlFor="sometimes" className="cursor-pointer">{t("sunscreenOften")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="rarely" id="rarely" />
                    <Label htmlFor="rarely" className="cursor-pointer">{t("sunscreenRarely")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="never" id="never" />
                    <Label htmlFor="never" className="cursor-pointer">{t("sunscreenNever")}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("upload")}
                >
                  {t('back')}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={!isQuestionnaireComplete || analyzeMutation.isPending}
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                       {t('analyzing')}
                    </>
                  ) : (
                    t('analyze')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">{t('preciseAnalysis')}</h3>
              <p className="text-sm text-muted-foreground">{t('preciseAnalysisDesc')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">{t('progressChart')}</h3>
              <p className="text-sm text-muted-foreground">{t('progressChartDesc')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-semibold mb-1">{t('personalRecommendations')}</h3>
              <p className="text-sm text-muted-foreground">{t('personalRecommendationsDesc')}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentCheckout
          language={language}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
