
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, DollarSign, Target, Crown, Building2, User, Landmark } from "lucide-react";

interface CustomerSegment {
  type: "Individual" | "SME" | "Corporate" | "Government";
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  pricingTier: "Basic" | "Premium" | "Enterprise" | "Government";
  discountPercentage: number;
  creditLimit: number;
  paymentTerms: string;
  features: string[];
  count: number;
  totalRevenue: number;
}

interface CustomerSegmentManagerProps {
  onSegmentChange: (segment: CustomerSegment) => void;
  currentSegment?: string;
}

const CustomerSegmentManager: React.FC<CustomerSegmentManagerProps> = ({
  onSegmentChange,
  currentSegment = "Individual"
}) => {
  const [selectedSegment, setSelectedSegment] = useState(currentSegment);

  const customerSegments: CustomerSegment[] = [
    {
      type: "Individual",
      name: "Individual Customers",
      description: "Personal customers and households",
      icon: <User className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
      pricingTier: "Basic",
      discountPercentage: 0,
      creditLimit: 5000,
      paymentTerms: "Net 7",
      features: ["Basic Support", "Standard Pricing", "Monthly Billing"],
      count: 245,
      totalRevenue: 125000
    },
    {
      type: "SME",
      name: "Small & Medium Enterprises",
      description: "Small businesses and startups",
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      pricingTier: "Premium",
      discountPercentage: 10,
      creditLimit: 25000,
      paymentTerms: "Net 14",
      features: ["Priority Support", "Volume Discounts", "Flexible Payment Terms"],
      count: 89,
      totalRevenue: 275000
    },
    {
      type: "Corporate",
      name: "Corporate Clients",
      description: "Large corporations and enterprises",
      icon: <Crown className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800",
      pricingTier: "Enterprise",
      discountPercentage: 20,
      creditLimit: 100000,
      paymentTerms: "Net 30",
      features: ["Dedicated Account Manager", "Custom Pricing", "24/7 Support", "SLA Guarantee"],
      count: 34,
      totalRevenue: 485000
    },
    {
      type: "Government",
      name: "Government Entities",
      description: "Government agencies and public sector",
      icon: <Landmark className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800",
      pricingTier: "Government",
      discountPercentage: 15,
      creditLimit: 200000,
      paymentTerms: "Net 45",
      features: ["Government Pricing", "Compliance Support", "Extended Payment Terms"],
      count: 12,
      totalRevenue: 320000
    }
  ];

  const handleSegmentSelect = (segmentType: string) => {
    const segment = customerSegments.find(s => s.type === segmentType);
    if (segment) {
      setSelectedSegment(segmentType);
      onSegmentChange(segment);
    }
  };

  const selectedSegmentData = customerSegments.find(s => s.type === selectedSegment);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Customer Segmentation & Pricing Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerSegments.map((segment) => (
              <Card 
                key={segment.type}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSegment === segment.type ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSegmentSelect(segment.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${segment.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                      {segment.icon}
                    </div>
                    <div>
                      <Badge className={segment.color}>
                        {segment.pricingTier}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1">{segment.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{segment.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Customers:</span>
                      <span className="font-semibold">{segment.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-semibold">RM{(segment.totalRevenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="font-semibold">{segment.discountPercentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Segment Details */}
      {selectedSegmentData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedSegmentData.icon}
              {selectedSegmentData.name} - Pricing & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Pricing Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pricing Tier:</span>
                      <Badge className={selectedSegmentData.color}>
                        {selectedSegmentData.pricingTier}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="font-semibold">{selectedSegmentData.discountPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credit Limit:</span>
                      <span className="font-semibold">RM{selectedSegmentData.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Terms:</span>
                      <span className="font-semibold">{selectedSegmentData.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Segment Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-blue-600">{selectedSegmentData.count}</div>
                      <div className="text-xs text-gray-600">Customers</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-green-600">
                        RM{(selectedSegmentData.totalRevenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Features & Benefits</h4>
                <ul className="space-y-2">
                  {selectedSegmentData.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Apply Segment Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerSegmentManager;
