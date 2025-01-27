
import Subscriptions  from '@/components/lemon-squeezy/Subscriptions';
import { prisma } from '@/lib/db';
import { getUserSubscriptions, syncPlans } from '@/lib/lemon-squeezy/actions';
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function MyAccount() {
    

    const userSubscriptions = await getUserSubscriptions();
    let allPlans = await prisma.subscriptionPlan.findMany();

    // If there are no plans in the database, sync them from Lemon Squeezy.
    // You might want to add logic to sync plans periodically or a webhook handler.
    if (!allPlans.length) {
        allPlans = await syncPlans();
    }

    // Show active subscriptions first, then paused, then canceled
    const sortedSubscriptions = userSubscriptions.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') {
            return -1;
        }

        if (a.status === 'paused' && b.status === 'cancelled') {
            return -1;
        }

        return 0;
    });

    return (
        
        <DashboardLayout>
           <Subscriptions userSubscriptions={sortedSubscriptions} allPlans={allPlans} />
        </DashboardLayout>
    );
}




