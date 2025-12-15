"use client";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation"; //or whatever method
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

//some mock data until API is ready
interface Activity{
    id: string;
    name: string;
    startTime:Date;
    endTime:Date;
}

const mockActivities: Activity[] = [
    {id: '1', name: 'Picking', startTime: new Date('2025-12-15T06:00:00'), endTime: new Date('2025-07-01T07:00:00')},
    {id: '2', name: 'Sorting', startTime: new Date('2025-12-15T09:00:00'), endTime: new Date('2025-07-01T10:00:00')},
    {id: '3', name: 'Inventory count', startTime: new Date('2025-12-15T12:30:00'), endTime: new Date('2025-07-01T13:30:00')},
    {id: '4', name: 'Unpacking', startTime: new Date('2025-12-15T14:00:00'), endTime: new Date('2025-07-01T17:00:00')},
];


/*The actual page:
Iterates through the sorted activities and displays them with:
Start button- disabled if the activity is already started
Stop button- disabled unless that activity has been started*/
export default function SchedulePage(){

    const router = useRouter();
    const searchParams = useSearchParams();
    //const employeeId = SearchParamsContext.get("employeeID")
    const employeeId = "123"; //temp
    const date = new Date().toISOString().split('T')[0];
    const customActivityParam = searchParams.get("customActivity");
    
    const [activities, setActivities] = useState<Activity[]>(mockActivities); //will be used when API is ready
    const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

    //API calls will go here later
    useEffect(() => {
        /*
        if (!employeeID) return; //guard clause

        const queryParams = new URLSearchParams({employeeID});
        if (date) {
            queryParams.append('date', date);
        }
        
        fetch('/api/activities?${queryParams.toString()}')
            .then((res) => res.json())
            .then(data => {
                const parsedData = data.map((item: any) => ({
                    ...item,
                    startTime: new Date(item.startTime),
                    endTime: new Date(item.endTime),
                }));
                setActivities(parsedData);
            });
        */
    }, [/*employeeID*/]);

    //Add custom activity if they have been added via CustomActivity page
    useEffect(() => {
        if (customActivityParam) {
            const parsed = JSON.parse(decodeURIComponent(customActivityParam));
            setActivities((prev) => {
                const exists = prev.find(a => a.id === parsed.id);
                if (exists) return prev; //avoid duplicates
                return [...prev, {...parsed,
                    startTime: new Date(parsed.startTime),
                    endTime: new Date(parsed.endTime)}];
            });

            //Remove old customActivity param from URL to prevent duplicates
            const url = new URL(window.location.href);
            url.searchParams.delete("customActivity");
            window.history.replaceState({}, '', url.toString());
        }
    }, [customActivityParam]);

    //sort activites by start time
    const sortedActivities = [...activities].sort(
        (a,b) => a.startTime.getTime() - b.startTime.getTime()
    );

    return (
        <main className="p-4">
            <h1 className="py-5">Schedule</h1>
             <div className="mb-4">
                <Button onClick={() => router.push("/")}>Go Back</Button>
            </div>
            <ul className="space-y-2">
                {sortedActivities.map((activity, index) => (
                    <li key={activity.id} className="py-4">
                    <div className="space-y-2">
                        <div>
                            <strong> {activity.name}</strong> - {activity.startTime.toLocaleTimeString()} to {activity.endTime.toLocaleTimeString()}
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => setActiveActivityId(activity.id)}
                            disabled = {activeActivityId !== null}
                            >
                                Start 
                            </Button>

                            <Button onClick={() => setActiveActivityId(null)}
                            disabled = {activeActivityId !== activity.id}
                            >
                                Stop
                            </Button>
                        </div>
                    </div>
                    {/* Separator between items */}
                    {index < sortedActivities.length - 1 && (
                        <div className="mt-4">
                            <Separator />
                        </div>
                    )}
                     
                    </li>
                ))}
            </ul>
            <div className="py-4">
                <Button onClick={() => router.push(`/customActivity?employeeId=${employeeId}`)}>
                    Custom Activity
                </Button>
            </div>
            
        </main>
    );
}