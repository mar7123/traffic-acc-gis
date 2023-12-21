'use client'
import Link from "next/link";
import { Breadcrumb } from 'flowbite-react';

const BreadcrumbComponent = ({ pageName }: { pageName: string }) => {
    const path = pageName.split('/');
    return (
        <div className="w-full mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb>
                {path.map((item, idx) => {
                    const href = item.replaceAll(' ', '').toLowerCase();
                    return (
                        <Breadcrumb.Item key={idx} href={"" + href} >
                            <span className="text-gray-900 text-lg">
                                {item}
                            </span>
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        </div>
    );
};

export default BreadcrumbComponent;
