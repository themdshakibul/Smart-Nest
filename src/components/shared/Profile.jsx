import React from 'react';
import { Card, Chip, Button } from "@heroui/react";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  UserCheck,
  Settings // 1. Imported Settings from lucide-react
} from "lucide-react";
import Image from 'next/image';

const Profile = ({ user }) => {
  console.log(user);

  // Fallback data handling if props are rendering asynchronously
  if (!user) {
    return <div className="text-muted text-sm font-body p-6">Loading user configuration...</div>;
  }

  // Format dates gracefully
  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })
    : "N/A";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 font-body text-foreground animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Upper Feature Profile Banner Card */}
      <Card className="bg-surface border border-border/20 shadow-xl overflow-hidden rounded-3xl mb-6">
        <div className="h-32 bg-gradient-to-r from-primary via-midnight-emerald to-secondary opacity-90 relative" />
        
        {/* Fixed positioning combo: clear separation below banner for tablet viewports */}
        <div className="px-6 pb-6 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-5 -mt-16 md:-mt-14 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 w-full min-w-0">
            {/* Avatar Container with solid ring border safety */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-surface shadow-md bg-card shrink-0 relative z-10">
              <Image
                src={user.image || "https://t4.ftcdn.net/jpg/11/57/72/95/360_F_1157729568_bzWI9dV4PoA1URwoIwgqeXO50BhQ3kfR.jpg"} 
                alt={user.name || "User Avatar"}
                fill
                sizes="(max-width: 640px) 112px, 128px"
                className='object-cover'
                priority
              />
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0 pt-1 md:pt-0 w-full mt-2 md:mt-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-foreground truncate max-w-full">
                  {user.name || "User Identity"}
                </h1>
                <Chip 
                  size="sm" 
                  className="bg-secondary/15 text-secondary border border-secondary/30 font-semibold uppercase tracking-wider text-[10px] shrink-0"
                >
                  {user.role || "User"}
                </Chip>
              </div>
              <p className="text-muted text-sm flex items-center justify-center md:justify-start gap-1.5 font-medium break-all">
                <Mail size={14} className="shrink-0" /> {user.email}
              </p>
            </div>
          </div>

          {/* Account Settings Action Trigger */}
          <div className="w-full md:w-auto shrink-0 z-10">
            <Button 
              variant="flat" 
              size="sm"
              className="bg-card hover:bg-surface-container-high border border-border/20 text-foreground font-semibold px-4 rounded-xl transition-all w-full flex items-center justify-center gap-2"
            >
              {/* 2. Swapped <Gear /> to Lucide component <Settings /> */}
              <Settings size={16} />
              <span>Account Actions</span>
            </Button>
          </div>

        </div>
      </Card>

      {/* Main Body Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Hand Block: Dynamic Pillar Metrics */}
        <div className="lg:col-span-1">
          <Card className="bg-surface border border-border/20 shadow-lg rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4 block">
              Identity & History
            </h3>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              {/* Role Row Indicator */}
              <div className="flex-1 flex items-center justify-between gap-4 p-3 rounded-xl bg-card/60 border border-border/10 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <UserCheck size={18} className="text-secondary shrink-0" />
                  <span className="text-xs font-semibold truncate">Assigned Role</span>
                </div>
                <span className="text-xs font-bold uppercase bg-secondary/15 text-secondary px-2.5 py-1 rounded-lg border border-secondary/20 shrink-0">
                  {user.role || "User"}
                </span>
              </div>

              {/* Established Creation Indicator Row */}
              <div className="flex-1 flex items-center justify-between gap-4 p-3 rounded-xl bg-card/60 border border-border/10 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Calendar size={18} className="text-secondary shrink-0" />
                  <span className="text-xs font-semibold truncate">Established</span>
                </div>
                <span className="text-xs font-semibold text-muted shrink-0 text-right">
                  {joinDate}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Hand Block: Detailed System Metadata Fields Info */}
        <div className="lg:col-span-2">
          <Card className="bg-surface border border-border/20 shadow-lg rounded-2xl p-5 md:p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">
              Registration Metadata Details
            </h3>

            <div className="grid grid-cols-1 gap-4 w-full">
              {/* Joined Timestamp Container Element */}
              <div className="space-y-1.5 p-4 rounded-xl bg-card/40 border border-border/10 transition-colors hover:bg-card/70">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={12} /> Account Established
                </label>
                <p className="text-sm text-foreground font-semibold">
                  {joinDate}
                </p>
              </div>

              {/* Custom Status Card Container Row */}
              <div className="space-y-1.5 p-4 rounded-xl bg-card/40 border border-border/10 transition-colors hover:bg-card/70">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon size={12} /> Complete Username Allocation
                </label>
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  Allocated under the name <span className="font-bold text-secondary">"{user.name}"</span> using authentic credentials authority networks.
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default Profile;