import { Card, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDashboardStats } from "../../features/research/researchSlice";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.research);
  console.log(stats);
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <h2 className="text-3xl font-bold">{stats.totalPosts}</h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Users</p>
          <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Views</p>
          <h2 className="text-3xl font-bold">
            {Math.floor(stats.totalViews / 1000)}k
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}
