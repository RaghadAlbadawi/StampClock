"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface Activity {
  id: string;
  name: string;
  departmentId: string;
  startTime?: string; // string for time input
  endTime?: string;
}

interface Department {
  id: string;
  name: string;
}

// Mock departments
const mockDepartments: Department[] = [
  { id: "123", name: "Warehouse" },
  { id: "124", name: "Admin" },
];

// Mock activities
const mockActivities: Activity[] = [
  { id: "101", name: "Check inventory", departmentId: "123" },
  { id: "102", name: "Clean area", departmentId: "123" },
  { id: "103", name: "Move pallets", departmentId: "123" },
  { id: "201", name: "Validate orders", departmentId: "124" },
];

export default function CustomActivitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employeeId");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);

  const [startTimes, setStartTimes] = useState<{ [key: string]: string }>({});
  const [endTimes, setEndTimes] = useState<{ [key: string]: string }>({});

  // Mock API fetch
  useEffect(() => {
    /*
    // Example API call when ready
    if (!employeeId) return;
    fetch(`/api/customactivities?employeeId=${employeeId}`)
      .then(res => res.json())
      .then(data => setActivities(data));
    */

    // For now use mock data
    setActivities(mockActivities);
  }, [employeeId]);

  const handleSelect = (activity: Activity) => {
    const startTime = startTimes[activity.id];
    const endTime = endTimes[activity.id];
    const today = new Date().toISOString().split('T')[0];

    if (!startTime || !endTime) {
      alert("Please specify start and end times");
      return;
    }

    const activityWithTimes = {
      ...activity,
      startTime: `${today}T${startTime}`,
      endTime: `${today}T${endTime}`,
      id: `${activity.id}-${Date.now()}`, // unique ID
    };

    const activityParam = encodeURIComponent(JSON.stringify(activityWithTimes));
    router.push(`/schedule?employeeId=${employeeId}&customActivity=${activityParam}`);
  };

  // Group activities by department
  const groupedActivities = departments.map((dept) => ({
    ...dept,
    activities: activities.filter((a) => a.departmentId === dept.id),
  }));

  return (
    <main className="p-4">
        <h1 className="py-5">Custom Activities</h1>
        <div className="mb-4">
            <Button onClick={() => router.push("/schedule?employeeId=${employeeId}")}>Go Back</Button>
        </div>
      {groupedActivities.map((dept) => (
        <div key={dept.id} className="mb-6">
          <h2>{dept.name}</h2>
          <Separator className="my-2" />
          <ul className="space-y-2">
            {dept.activities.map((activity) => (
              <li key={activity.id} className="py-2">
                {activity.name}
                <div className="flex items-center space-x-2 mt-1">
                  <label>
                    Start:{" "}
                    <Input
                      type="time"
                      value={startTimes[activity.id] || ""}
                      onChange={(e) =>
                        setStartTimes((prev) => ({ ...prev, [activity.id]: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    End:{" "}
                    <Input
                      type="time"
                      value={endTimes[activity.id] || ""}
                      onChange={(e) =>
                        setEndTimes((prev) => ({ ...prev, [activity.id]: e.target.value }))
                      }
                    />
                  </label>
                  <Button onClick={() => handleSelect(activity)}>Select</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
