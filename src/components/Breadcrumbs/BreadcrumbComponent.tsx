'use client'
import Link from "next/link";
import { Breadcrumb } from 'flowbite-react';

const BreadcrumbComponent = ({ pageName, query_string = "" }: { pageName: string, query_string?: string }) => {
    const path = pageName.split('/');
    const query_exist = (query_string == "" ? "" : "?")
    return (
        <div className="w-full mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb>
                {path.map((item, idx) => {
                    const href = (idx != path.length - 1 ? (item.replaceAll(' ', '').toLowerCase()) : (item.replaceAll(' ', '').toLowerCase() + query_exist + query_string));
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
