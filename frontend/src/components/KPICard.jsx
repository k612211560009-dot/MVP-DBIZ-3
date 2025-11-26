import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const KPICard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={`text-xs ${
              changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change} {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
