import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import db from "@/db/db";

// await waits to continue until it's synced the database
async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { priceInCents: true },
    _count: { _all: true }, // Fix this part
  });

  return {
    amount: (data._sum.priceInCents || 0) / 100,
    numberOfSales: data._count._all,
  };
}


async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { priceInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.priceInCents || 0) / userCount / 100,
  };
}
async function getProductData() {
  const [activecount, inactivecount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);
  return {
    activecount,
    inactivecount,
  };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  // different amount of grids depending on screen sizes
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
      <DashboardCard
        title="Sale"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={`Total Sales: ${formatCurrency(salesData.amount)}`}
      />

      <DashboardCard
        title="Customer"
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />

      <DashboardCard
        title="Active Products"
        subtitle={`Inactive: ${formatNumber(productData.inactivecount)}`}
        body={`Active: ${formatNumber(productData.activecount)}`}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
