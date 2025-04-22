'use client'
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const SeriesWatchBtn = () => {

    const { id } = useParams()

    const router = useRouter();

    return (
        <>
            <button
                className={
                    "w-[100px] bg-red-600 text-white rounded-2xl pt-1 pb-1 pr-4 pl-4 hover:duration-[0.4s] hover:bg-white hover:text-red-600 ml-10"
                }
                onClick={() => router.push(`/series/${id}/1/episodes`)}
            >
                شاهد الأن
            </button>
        </>
    );
};

export default SeriesWatchBtn;
