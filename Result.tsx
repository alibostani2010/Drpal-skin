    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getPositionColor = (position: string) => {
    if (position === "green_zone") return "bg-green-100 text-green-800 border-green-300";
    if (position === "average_zone") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  const getPositionText = (position: string) => {
    if (language === "fa") {
      if (position === "green_zone") return "منطقه سبز";
      if (position === "average_zone") return "منطقه متوسط";
      return "منطقه قابل بهبود";
    } else if (language === "ar") {
      if (position === "green_zone") return "المنطقة الخضراء";
      if (position === "average_zone") return "المنطقة المتوسطة";
      return "منطقة قابلة للتحسين";
    } else {
      if (position === "green_zone") return "Green Zone";
      if (position === "average_zone") return "Average Zone";
      return "Improvement Zone";
    }
  };

  const handleShare = () => {
    const text = language === "fa" 
      ? `تحلیل پوست من: امتیاز ${result.skin_health_score}/100`
      : language === "ar"
      ? `تحليل بشرتي: درجة ${result.skin_health_score}/100`
      : `My skin analysis: Score ${result.skin_health_score}/100`;
    
    if (navigator.share) {
      navigator.share({ title: "Dr.PAL Skin Analysis", text });
    } else {
      alert(text);
    }
  };

  const handleDownload = () => {
    const text = JSON.stringify(result, null, 2);
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "skin-analysis.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/drpal-hero.png" alt="Dr.PAL" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold">{t("analysisResults")}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 ml-2" />
              {t("share")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 ml-2" />
              {t("download")}
            </Button>