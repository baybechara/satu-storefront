"use client"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export function ProductDrawer({ product, open, onOpenChange }: { product: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background border-border rounded-t-3xl max-h-[90vh] max-w-[820px] mx-auto">
        <DrawerTitle className="sr-only">{product.name}</DrawerTitle>
        <DrawerDescription className="sr-only">{product.category}</DrawerDescription>

        <div className="flex-1 overflow-y-auto px-4 pb-[120px] pt-4 scrollbar-hide">
          {/* Image Slider */}
          <Carousel className="w-full mb-4">
            <CarouselContent className="-ml-3">
              {product.images.map((img: string, i: number) => (
                <CarouselItem key={i} className="pl-3 basis-[85%] sm:basis-1/2">
                  <div className="relative h-[300px] rounded-2xl overflow-hidden bg-muted border border-border/50">
                    <Image src={img} alt={product.name} fill className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="space-y-6 mt-2">
            <div>
              <div className="mb-4">
                <Badge variant="outline" className="text-muted-foreground font-medium px-3 py-1">
                  {product.category}
                </Badge>
              </div>
              <h2 className="text-xl font-bold mb-2 text-foreground leading-tight">{product.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-3 pb-3 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center min-w-[48px]">
                <span className="font-semibold text-base text-foreground whitespace-nowrap">{quantity} шт.</span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(quantity + 1)}
                disabled={product.qty !== undefined && quantity >= product.qty}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1 ml-4 font-semibold flex justify-between items-center pl-6 pr-[4px] text-background bg-foreground hover:bg-foreground/90">
              <span>В корзину</span>
              <span className="bg-background/20 text-background px-4 h-[34px] flex items-center justify-center rounded-[4px] text-sm shrink-0">{product.price * quantity} сом</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
