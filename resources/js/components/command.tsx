"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Link, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"



export function CommandMenu() {
    const { routes } = usePage<SharedData>().props; // <-- destructure routes here
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <div className="w-auto  justify-center hidden sm:flex">
                <Button
                    className="shadow-none select-none items-center gap-1 w-auto rounded-xl font-medium "
                    onFocus={() => setOpen(true)}
                    aria-label="Open command menu"
                    style={{ cursor: "pointer" }}
                    variant={'ghost'}
                >Search <span className="text-muted-foreground">(⌘+K)</span>
                </Button>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search Routes..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Pages">
                        <ScrollArea className="h-50 w-full rounded-md">
                            {Array.isArray(routes) && routes.map((route) => (
                                <Link href={route.url}>
                                    <CommandItem key={route.name}>
                                        <span>{route.name}</span>
                                    </CommandItem>
                                </Link>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}