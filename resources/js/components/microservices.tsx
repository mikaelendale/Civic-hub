"use client"

import type React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Info, ExternalLink, Zap, Shield, Rocket, Globe, Database, Code, ArrowRight } from "lucide-react"
import { GoogleGmail } from "brand-logos"
interface CardData {
    id: string
    icon: React.ReactNode
    name: string
    description: string
    modalInfo: string
    jumpUrl: string
}

const cardData: CardData[] = [
    {
        id: "1",
        icon: <GoogleGmail className="w-8 h-8 text-muted-foreground" />,
        name: "Lightning Fast",
        description: "Experience blazing fast performance with our optimized infrastructure and cutting-edge technology.",
        modalInfo:
            "Our lightning-fast platform uses advanced caching, CDN distribution, and optimized code to deliver content in milliseconds. Built on modern architecture with global edge servers.",
        jumpUrl: "#",
    },
    {
        id: "2",
        icon: <Shield className="w-8 h-8 text-muted-foreground" />,
        name: "Secure & Safe",
        description: "Enterprise-grade security with end-to-end encryption and advanced threat protection.",
        modalInfo:
            "We implement military-grade encryption, regular security audits, and compliance with industry standards like SOC 2 and GDPR to keep your data safe.",
        jumpUrl: "#",
    },
    {
        id: "3",
        icon: <Rocket className="w-8 h-8 text-muted-foreground" />,
        name: "Easy Deploy",
        description: "Deploy your applications with a single click and scale automatically based on demand.",
        modalInfo:
            "Our deployment system supports multiple frameworks, automatic scaling, and zero-downtime deployments. Connect your Git repository and deploy instantly.",
        jumpUrl: "#",
    },
    {
        id: "4",
        icon: <Globe className="w-8 h-8 text-muted-foreground" />,
        name: "Global Reach",
        description: "Serve your users worldwide with our distributed network of edge locations.",
        modalInfo:
            "With 50+ edge locations across 6 continents, we ensure your content is delivered from the closest server to your users for optimal performance.",
        jumpUrl: "#",
    },
    {
        id: "5",
        icon: <Database className="w-8 h-8 text-muted-foreground" />,
        name: "Smart Storage",
        description: "Intelligent data management with automatic backups and real-time synchronization.",
        modalInfo:
            "Our smart storage system includes automatic backups, version control, real-time sync across devices, and intelligent data compression to save space.",
        jumpUrl: "#",
    },
    {
        id: "6",
        icon: <Code className="w-8 h-8 text-muted-foreground" />,
        name: "Developer Tools",
        description: "Comprehensive toolkit with APIs, SDKs, and debugging tools for seamless development.",
        modalInfo:
            "Access powerful APIs, multiple language SDKs, real-time debugging tools, and comprehensive documentation to build amazing applications faster.",
        jumpUrl: "#",
    },
]

export default function Microservices() {
    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardData.map((card) => (
                    <Card
                        key={card.id}
                        className="group transition-transform duration-200 bg-primary-foreground border border-accent shadow-none"
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-start">{card.icon} <h3 className="ml-2 text-xl font-bold text-primary">{card.name}</h3></div>
                        </CardHeader>
                        <CardContent className="">
                            <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-dashed pt-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Info
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            {card.icon}
                                            {card.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-left leading-relaxed">{card.modalInfo}</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>

                            <Button
                                asChild
                                variant={'link'}
                                size="sm"
                                className="flex items-center gap-2 shadow-none"
                            >
                                <a href={card.jumpUrl}>
                                    Jump
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
