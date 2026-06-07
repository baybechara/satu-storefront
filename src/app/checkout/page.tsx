"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, Trash2, MessageCircle, ArrowLeft, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const MOCK_CART_ITEM = {
  id: 1,
  name: "Утюг Beko SIM3122T",
  price: 2884,
  image: "https://picsum.photos/seed/iron1/600/600",
  qty: 1
}

const DELIVERY_SETTINGS = {
  pickup: {
    address: "г. Бишкек, ЦУМ"
  },
  courier: {
    price: 150,
    freeThreshold: 4000
  }
}

export default function CheckoutPage() {
  const [qty, setQty] = useState(MOCK_CART_ITEM.qty)
  const [deliveryMethod, setDeliveryMethod] = useState("pickup")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [comment, setComment] = useState("")

  const isValid = name.trim() !== "" && phone.trim() !== "" && (deliveryMethod === "pickup" || address.trim() !== "")

  const handleSubmit = (e: React.MouseEvent) => {
    if (!isValid) {
      if (!name.trim()) document.getElementById('name')?.focus()
      else if (!phone.trim()) document.getElementById('phone')?.focus()
      else if (deliveryMethod === "delivery" && !address.trim()) document.getElementById('address')?.focus()
      return
    }
    // TODO: WhatsApp API integration
    console.log("Submit", { name, phone, address, comment, deliveryMethod, qty })
  }
  
  const itemsTotal = MOCK_CART_ITEM.price * qty
  const minOrder = 4000 // For the warning message below if needed
  
  // Calculate delivery cost based on logic from admin panel
  let deliveryCost = 0
  if (deliveryMethod === "delivery") {
    deliveryCost = itemsTotal >= DELIVERY_SETTINGS.courier.freeThreshold ? 0 : DELIVERY_SETTINGS.courier.price
  }
  
  const finalTotal = itemsTotal + deliveryCost

  return (
    <main className="min-h-screen bg-muted/30 pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border/40">
        <div className="w-full max-w-[820px] mx-auto px-4 h-16">
          <Link href="/" className="flex items-center gap-3 h-full w-full group cursor-pointer">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-background border border-border/50 shadow-sm shrink-0 transition-colors group-hover:bg-accent">
              <ArrowLeft className="h-4 w-4 text-foreground/80 group-hover:text-foreground" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Оформить покупку</h1>
          </Link>
        </div>
      </header>

      <div className="w-full max-w-[820px] mx-auto p-4 pt-6">
        <div className="space-y-6">
          {/* Cart Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 border border-border rounded-lg p-3 bg-card">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                  <Image src={MOCK_CART_ITEM.image} alt={MOCK_CART_ITEM.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate leading-snug">{MOCK_CART_ITEM.name}</h4>
                  <div className="font-bold mt-1">{MOCK_CART_ITEM.price} сом</div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="font-medium w-6 text-center text-sm">{qty}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(qty + 1)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Товары ({qty})</span>
                  <span>{itemsTotal} сом</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>{deliveryMethod === "pickup" ? "Бесплатно" : (deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} сом`)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t font-bold text-xl">
                  <span>Итого к оплате</span>
                  <span>{finalTotal} сом</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Methods */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Способ доставки</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                <div className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${deliveryMethod === "pickup" ? "bg-primary/5 border-primary" : "border-border hover:bg-muted/50"}`} onClick={() => setDeliveryMethod("pickup")}>
                  <RadioGroupItem value="pickup" id="pickup" className={`mt-1 ${deliveryMethod === "pickup" ? "border-primary text-primary" : ""}`} />
                  <div className="grid gap-1.5">
                    <Label htmlFor="pickup" className="font-medium cursor-pointer text-sm leading-none">Самовывоз из магазина</Label>
                    <p className="text-sm text-muted-foreground">{DELIVERY_SETTINGS.pickup.address}</p>
                  </div>
                </div>
                <div className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${deliveryMethod === "delivery" ? "bg-primary/5 border-primary" : "border-border hover:bg-muted/50"}`} onClick={() => setDeliveryMethod("delivery")}>
                  <RadioGroupItem value="delivery" id="delivery" className={`mt-1 ${deliveryMethod === "delivery" ? "border-primary text-primary" : ""}`} />
                  <div className="grid gap-1.5">
                    <Label htmlFor="delivery" className="font-medium cursor-pointer text-sm leading-none">Доставка курьером</Label>
                    <p className="text-sm text-muted-foreground">
                      Стоимость: {DELIVERY_SETTINGS.courier.price} сом. 
                      Бесплатно при заказе от {DELIVERY_SETTINGS.courier.freeThreshold} сом.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* User Info Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Контактные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя <span className="text-destructive">*</span></Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Иван Иванов" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон <span className="text-destructive">*</span></Label>
                <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+996 555 123 456" />
              </div>
              
              {deliveryMethod === "delivery" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="address">Адрес доставки <span className="text-destructive">*</span></Label>
                  <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Город, улица, дом, квартира..." />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Напишите здесь любую дополнительную информацию..." className="resize-none" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Footer Submit */}
          <div className="flex flex-col gap-4 pt-4">

            {/* Terms and Conditions Block */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors border border-border/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Info className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-foreground">Важная информация</h4>
                  <p className="text-sm text-muted-foreground">Условия доставки, возврата и оплаты</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-[#F4F4F5] via-[#F4F4F5] to-transparent z-40 pb-safe">
        <div className="max-w-[820px] mx-auto px-4">
          <Button 
            size="lg"
            onClick={handleSubmit}
            className={`w-full text-base font-semibold shadow-lg shadow-black/5 flex justify-center items-center transition-colors ${
              isValid 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Оформить заказ на {finalTotal} сом
          </Button>
        </div>
      </div>
    </main>
  )
}
