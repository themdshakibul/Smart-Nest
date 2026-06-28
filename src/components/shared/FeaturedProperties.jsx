import { getHomeProperties } from '@/lib/api/properties';
import React from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import FeaturedGridClient from './FeaturedGridClient';


const FeaturedProperties = async () => {
    let featuredProperties = [];
    try {
        featuredProperties = await getHomeProperties();
    } catch (error) {
        console.error("Failed to load featured properties:", error);
    }

    return (
        <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="max-w-2xl space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-8 bg-secondary/60"></span>
                        <p className="text-secondary font-body font-semibold text-xs tracking-widest uppercase">
                            Featured Collection
                        </p>
                    </div>
                    
                    <h2 className="font-heading text-2xl sm:text-4xl text-primary font-bold tracking-tight leading-tight">
                        Handpicked Spaces for <br className="hidden sm:inline" /> Your Next Chapter
                    </h2>
                    
                    <p className="text-muted font-body text-[15px] sm:text-base max-w-xl leading-relaxed">
                        Explore our highest-rated, architecturally stunning rental properties equipped with intuitive smart technology features tailored for living.
                    </p>
                </div>

                <div className="flex shrink-0">
                    <Link href="/properties">
                        <Button 
                            className="bg-primary hover:bg-tertiary text-on-primary font-body font-medium px-6 py-5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                        >
                            Explore All Listings
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Interactive Animated Cards Grid */}
            <FeaturedGridClient properties={featuredProperties || []} />
        </section>
    );
};

export default FeaturedProperties;