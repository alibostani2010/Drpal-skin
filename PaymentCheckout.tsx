import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Check } from "lucide-react";
import { getTranslation } from "@/lib/translations-full";
import { trpc } from "@/lib/trpc";

interface PaymentCheckoutProps {
  language: string;
  onPaymentSuccess: (referralCode?: string) => void;
  onCancel: () => void;
}

export default function PaymentCheckout({ language, onPaymentSuccess, onCancel }: PaymentCheckoutProps) {
  const [referralCode, setReferralCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"knet" | "credit">("knet");
  const t = (key: any) => getTranslation(language, key);

  const prices = {
    ar: { amount: 20, currency: "AED", symbol: "د.إ" },
    en: { amount: 6, currency: "USD", symbol: "$" },
  };

  const price = prices[language as keyof typeof prices] || prices.en;

  // Use tRPC procedures
  const validateCodeQuery = trpc.payment.validateReferralCode.useQuery;
  const createChargeMutation = trpc.payment.createCharge.useMutation();

  const handleApplyCode = async () => {
    if (!referralCode.trim()) {
      setError(language === "fa" ? "لطفاً کد را وارد کنید" : language === "ar" ? "يرجى إدخال الرمز" : "Please enter a code");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Check if it's the master test code
      if (referralCode === "MASTER_TEST" || referralCode === "DRPAL2024") {
        setIsProcessing(false);
        onPaymentSuccess(referralCode);
        return;
      }

      // Validate referral code with backend using tRPC
      const result = await trpc.payment.validateReferralCode.query({ code: referralCode });

      if (result.isValid) {
        setIsProcessing(false);
        onPaymentSuccess(referralCode);
      } else {
        setError(language === "fa" ? "کد نامعتبر است" : language === "ar" ? "الرمز غير صحيح" : "Invalid code");
        setIsProcessing(false);
      }
    } catch (err) {
      setError(language === "fa" ? "خطا در بررسی کد" : language === "ar" ? "خطأ في التحقق من الرمز" : "Error validating code");
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // Create payment with Tap using tRPC
      const result = await createChargeMutation.mutateAsync({
        amount: price.amount,
        currency: price.currency as "KWD" | "AED" | "USD",
        language: language as "fa" | "ar" | "en",
        email: "user@example.com", // TODO: Get from user
        firstName: "User", // TODO: Get from user
        lastName: "", // TODO: Get from user
        referralCode: referralCode || undefined,
      });

      if (result.redirectUrl) {
        // Redirect to Tap payment page
        window.location.href = result.redirectUrl;
      } else if (result.success && result.isFree) {
        // Free version (Persian)
        onPaymentSuccess();
      } else {
        setError(result.message || (language === "fa" ? "خطا در پرداخت" : language === "ar" ? "خطأ في الدفع" : "Payment error"));
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || (language === "fa" ? "خطا در اتصال" : language === "ar" ? "خطأ في الاتصال" : "Connection error"));
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("payment")}</CardTitle>
          <CardDescription>
            {language === "fa" ? "تحلیل پوست و صورت" : language === "ar" ? "تحليل الجلد والوجه" : "Skin Analysis"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {language === "fa" ? "قیمت" : language === "ar" ? "السعر" : "Price"}
            </p>
            <p className="text-3xl font-bold">
              {price.symbol}{price.amount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{price.currency}</p>
          </div>

          {/* Referral Code Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {language === "fa" ? "کد معرفی (اختیاری)" : language === "ar" ? "رمز الإحالة (اختياري)" : "Referral Code (Optional)"}
            </label>
            <div className="flex gap-2">
              <Input
                placeholder={language === "fa" ? "کد معرفی" : language === "ar" ? "رمز الإحالة" : "Enter code"}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                disabled={isProcessing}
              />
              <Button
                variant="outline"
                onClick={handleApplyCode}
                disabled={isProcessing || !referralCode.trim()}
                size="sm"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : t("apply")}
              </Button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {language === "fa" ? "روش پرداخت" : language === "ar" ? "طريقة الدفع" : "Payment Method"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === "knet" ? "default" : "outline"}
                onClick={() => setPaymentMethod("knet")}
                disabled={isProcessing}
              >
                KNET
              </Button>
              <Button
                variant={paymentMethod === "credit" ? "default" : "outline"}
                onClick={() => setPaymentMethod("credit")}
                disabled={isProcessing}
              >
                {language === "fa" ? "کارت اعتباری" : language === "ar" ? "بطاقة ائتمان" : "Credit Card"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              {language === "fa" ? "انصراف" : language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {language === "fa" ? "پرداخت" : language === "ar" ? "دفع" : "Pay"}
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-muted-foreground text-center">
            {language === "fa"
              ? "پرداخت شما امن و محفوظ است"
              : language === "ar"
              ? "الدفع آمن وموثوق"
              : "Your payment is secure"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
