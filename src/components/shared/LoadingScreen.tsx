"use client";
import React from 'react';
import { Spin } from 'antd';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <Spin size="large" />
        </div>
    );
};

export default LoadingScreen;