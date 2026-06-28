import Profile from '@/components/shared/Profile';
import { getUserSession } from '@/lib/core/session';
import React from 'react';

const OwnerProfile = async() => {
    const user= await getUserSession();
    return (
        <div>
            <Profile user={user}/>
        </div>
    );
};

export default OwnerProfile;