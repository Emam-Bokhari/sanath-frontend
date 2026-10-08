"use client";

import { Button } from "antd";
import Link from "next/link";


export interface Props {
    item: any;
    onRemove: (id: string) => void;
}

export default function SavedSearchItem({ item, onRemove }: Props) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 `}>
            <div className="flex-1 min-w-0">
                <Link href={`/properties${item?._id}`}><h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.title}</h3></Link>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{item?.location?.address}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">

                <Button
                    type="link"
                    danger
                    onClick={() => onRemove(item?._id)}
                    className="!p-0 !h-auto font-medium text-sm"
                >
                    Remove
                </Button>
            </div>
        </div>
    );
}