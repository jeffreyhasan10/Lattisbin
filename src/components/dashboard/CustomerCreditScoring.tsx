
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Star, AlertTriangle } from "lucide-react";

interface CreditScoreData {
  score: number;
  rating: "Excellent" | "Good" | "Fair" | "Poor";
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    creditLength: number;
    creditMix: number;
    newCredit: number;
  };
  recommendations: string[];
  riskLevel: "Low" | "Medium" | "High";
}

interface CustomerCreditScoringProps {
  customerId: string;
  customerType: string;
  registrationDate: string;
  onScoreCalculated: (score: number, rating: string) => void;
}

const CustomerCreditScoring: React.FC<CustomerCreditScoringProps> = ({
  customerId,
  customerType,
  registrationDate,
  onScoreCalculated
}) => {
  const [creditData, setCreditData] = useState<CreditScoreData | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    calculateCreditScore();
  }, [customerId]);

  const calculateCreditScore = async () => {
    setCalculating(true);
    
    // Simulate credit score calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock calculation based on customer type and other factors
    const baseScore = customerType === "Corporate" ? 750 : 
                     customerType === "SME" ? 700 : 
                     customerType === "Government" ? 850 : 650;
    
    const randomVariation = Math.floor(Math.random() * 100) - 50;
    const finalScore = Math.max(300, Math.min(850, baseScore + randomVariation));
    
    const rating = finalScore >= 800 ? "Excellent" :
                  finalScore >= 700 ? "Good" :
                  finalScore >= 600 ? "Fair" : "Poor";
    
    const mockData: CreditScoreData = {
      score: finalScore,
      rating,
      factors: {
        paymentHistory: Math.floor(Math.random() * 100),
        creditUtilization: Math.floor(Math.random() * 100),
        creditLength: Math.floor(Math.random() * 100),
        creditMix: Math.floor(Math.random() * 100),
        newCredit: Math.floor(Math.random() * 100)
      },
      recommendations: [
        "Maintain consistent payment history",
        "Keep credit utilization below 30%",
        "Consider diversifying credit portfolio",
        "Monitor credit report regularly"
      ],
      riskLevel: finalScore >= 700 ? "Low" : finalScore >= 600 ? "Medium" : "High"
    };
    
    setCreditData(mockData);
    onScoreCalculated(finalScore, rating);
    setCalculating(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 600) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Fair": return "bg-yellow-100 text-yellow-800";
      case "Poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (calculating) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Calculating credit score...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditData) return null;

  return (
    <div className="space-y-4">
      {/* Credit Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Credit Score Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(creditData.score)}`}>
                {creditData.score}
              </div>
              <div className="text-sm text-gray-500">out of 850</div>
            </div>
            <div className="text-right">
              <Badge className={getRatingColor(creditData.rating)}>
                {creditData.rating}
              </Badge>
              <div className="mt-2">
                <Badge className={getRiskColor(creditData.riskLevel)}>
                  {creditData.riskLevel} Risk
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Score Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Credit Score Range</span>
              <span>{creditData.score}/850</span>
            </div>
            <Progress value={(creditData.score / 850) * 100} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>300</span>
              <span>850</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Credit Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(creditData.factors).map(([factor, score]) => (
            <div key={factor} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {creditData.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                {recommendation}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCreditScoring;
