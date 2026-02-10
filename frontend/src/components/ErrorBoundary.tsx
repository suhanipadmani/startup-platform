import React from 'react';

export class ErrorBoundary extends React.Component<any, any> {

    state = { hasError: false };

    static getDerivedStateFromError() { 
        return { hasError: true }; 
    }    
    
    render() {
        if (this.state.hasError) 
            return (
                <div className="h-screen flex items-center justify-center">
                    Something went wrong
                </div>
            );
        return this.props.children;
    }
}