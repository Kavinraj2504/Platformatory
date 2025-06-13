import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/profile.activities';


const { updateUserProfile } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
});

export async function updateUserProfileWorkflow(profile: any) {
  return await updateUserProfile(profile);
}
