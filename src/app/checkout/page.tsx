"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, Trash2, MessageCircle, ArrowLeft, Info, X, Copy, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ProductDrawer } from "@/components/ProductDrawer"

import { useCartStore } from "@/store/useCartStore"

const STORE_INFO = {
  name: "Beko Kyrgyzstan",
}
import { useEffect } from "react"
import { cn } from "@/lib/utils"

const DELIVERY_SETTINGS = {
  pickup: {
    address: "г. Бишкек, ЦУМ"
  },
  courier: {
    price: 150,
    freeThreshold: 4000
  }
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export default function CheckoutPage() {
  const { items, totalPrice, updateQuantity, removeItem } = useCartStore()
  const totalItemsCount = useCartStore(state => state.totalItems())
  const itemsTotal = totalPrice()
  const [mounted, setMounted] = useState(false)
  
  const [deliveryMethod, setDeliveryMethod] = useState("pickup")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [comment, setComment] = useState("")
  const [agreed, setAgreed] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false)

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setIsProductDrawerOpen(true)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderText, setOrderText] = useState("")
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedOrder, setCopiedOrder] = useState(false)
  const clearCart = useCartStore((state) => state.clearCart)

  const isValid = name.trim() !== "" && phone.trim() !== "" && (deliveryMethod === "pickup" || deliveryMethod === "info" || address.trim() !== "") && agreed

  const handleSubmit = (e: React.MouseEvent) => {
    if (!isValid) {
      if (!name.trim()) document.getElementById('name')?.focus()
      else if (!phone.trim()) document.getElementById('phone')?.focus()
      else if (deliveryMethod === "delivery" && !address.trim()) document.getElementById('address')?.focus()
      return
    }

    let text = `*Здравствуйте! Хочу оформить заказ:*\n\n`
    text += `*Корзина:*\n`
    items.forEach((item, index) => {
      text += `- ${item.product.name} — ${item.quantity} шт. (${item.product.price} сом)\n`
    })
    
    text += `\n*Итого товары:* ${itemsTotal} сом\n`
    
    text += `\n*Способ получения:*\n`
    if (deliveryMethod === "delivery") {
      text += `- Курьером\n`
      text += `- Стоимость: ${deliveryCost === 0 ? "Бесплатно" : deliveryCost + " сом"}\n`
      text += `*Сумма к оплате: ${itemsTotal + deliveryCost} сом*\n`
    } else if (deliveryMethod === "pickup") {
      text += `- Самовывоз из магазина\n`
      text += `*Сумма к оплате: ${itemsTotal} сом*\n`
    } else {
      text += `- Нужна консультация\n`
      text += `*Сумма к оплате: ${itemsTotal} сом*\n`
    }

    text += `\n*Данные покупателя:*\n`
    text += `- Имя: ${name}\n`
    text += `- Телефон: ${phone}\n`
    if (deliveryMethod === "delivery" && address) text += `- Адрес: ${address}\n`
    if (comment) text += `\n*Комментарий:*\n${comment}`

    setOrderText(text)
    setIsSubmitted(true)
    window.scrollTo(0, 0)
  }
  
  const minOrder = 4000 // For the warning message below if needed
  
  // Calculate delivery cost based on logic from admin panel
  let deliveryCost = 0
  if (deliveryMethod === "delivery") {
    deliveryCost = itemsTotal >= DELIVERY_SETTINGS.courier.freeThreshold ? 0 : DELIVERY_SETTINGS.courier.price
  }
  
  const finalTotal = itemsTotal + deliveryCost

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault()
    clearCart()
    window.location.href = "/"
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-muted/30 pb-20 flex flex-col items-center pt-12 px-4">
        <div className="w-full max-w-[600px] flex flex-col items-center">
          <h1 className="text-[28px] leading-tight font-semibold text-foreground mb-3 tracking-tight text-center">
            Заказ отправлен!
          </h1>
          <p className="text-[15px] text-muted-foreground text-center mb-8 max-w-sm">
            Мы свяжемся с вами в ближайшее время. Для ускорения обработки, вы можете продублировать заказ в WhatsApp.
          </p>

          <Button 
            className="w-full sm:w-auto px-10 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium text-[17px] rounded-full py-7 mb-10 shadow-xl shadow-[#25D366]/20 transition-all active:scale-[0.98]"
            onClick={() => window.open(`https://wa.me/996503310794?text=${encodeURIComponent(orderText)}`, '_blank')}
          >
            <WhatsAppIcon className="w-6 h-6 mr-2.5" />
            Отправить WhatsApp
          </Button>

          <Card className="w-full overflow-hidden border-border/50 shadow-sm rounded-[24px] bg-background">
            <CardHeader className="bg-transparent pb-0 pt-6 px-6">
              <div className="flex items-center justify-center pb-4">
                <div className="flex-1 border-t border-border/60"></div>
                <CardTitle className="text-[15px] font-medium text-foreground px-4 shrink-0">
                  Состав заказа
                </CardTitle>
                <div className="flex-1 border-t border-border/60"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 px-6 pb-8 space-y-8">
              
              <div className="space-y-0 bg-muted/30 p-2 rounded-[20px]">
                {items.map((item, i) => (
                  <div key={item.product.id} className={`flex justify-between items-center py-3 px-3 ${i !== items.length - 1 ? 'border-b border-border/50' : ''}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-border/50 bg-background">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <span className="text-[14px] font-medium leading-snug pr-4">{item.product.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2 text-muted-foreground bg-background border border-border/50 rounded-md px-2 py-1 text-xs">
                        {item.quantity} шт
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 pb-2 px-3 mt-1 flex justify-end items-center gap-4 text-[15px]">
                  <span className="text-muted-foreground">Итого</span>
                  <span className="font-semibold text-foreground">{finalTotal} сом</span>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-border/50 border-dashed">
                <div className="mb-6 pt-2">
                  <h3 className="font-medium text-[15px] mb-1.5 text-foreground">WhatsApp не открывается?</h3>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">Отправьте нам информацию о заказе вручную на наш номер.</p>
                </div>

                <div className="flex items-center justify-between p-2 pl-4 border border-border/60 rounded-[16px] bg-background">
                  <span className="font-medium text-[15px]">+996 503 310 794</span>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText("+996503310794");
                    setCopiedPhone(true);
                    setTimeout(() => setCopiedPhone(false), 2000);
                  }} className={`h-9 rounded-[10px] px-4 font-medium transition-all ${copiedPhone ? 'bg-green-50/50 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-600' : 'bg-transparent'}`}>
                    {copiedPhone ? <Check className="w-[18px] h-[18px] mr-2" /> : <Copy className="w-[18px] h-[18px] mr-2 text-muted-foreground" />}
                    {copiedPhone ? "Скопировано" : "Копировать"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 pl-4 border border-border/60 rounded-[16px] bg-background">
                  <span className="font-medium text-[15px]">Детали заказа</span>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(orderText);
                    setCopiedOrder(true);
                    setTimeout(() => setCopiedOrder(false), 2000);
                  }} className={`h-9 rounded-[10px] px-4 font-medium transition-all ${copiedOrder ? 'bg-green-50/50 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-600' : 'bg-transparent'}`}>
                    {copiedOrder ? <Check className="w-[18px] h-[18px] mr-2" /> : <Copy className="w-[18px] h-[18px] mr-2 text-muted-foreground" />}
                    {copiedOrder ? "Скопировано" : "Копировать"}
                  </Button>
                </div>
                
                <Textarea 
                  value={orderText}
                  readOnly
                  className="h-32 text-[13px] bg-muted/30 border-border/50 rounded-[16px] resize-none font-mono text-muted-foreground focus-visible:ring-0 px-4 py-3 shadow-none mt-2"
                />
              </div>

            </CardContent>
          </Card>
          
          <button onClick={handleReturnHome} className="mt-10 text-[14px] text-muted-foreground flex items-center hover:text-foreground transition-colors group pb-4">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Вернуться на главную
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/60">
        <div className="w-full max-w-[820px] mx-auto px-4 h-16">
          <Link href="/" className="flex items-center gap-3 h-full w-full group cursor-pointer">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-transparent border border-border/60 hover:bg-muted transition-colors shrink-0">
              <ArrowLeft className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <h1 className="text-lg font-medium text-foreground/90">Оформить покупку</h1>
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
              {mounted && items.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Корзина пуста</div>
              ) : (
                <div className="space-y-3">
                  {mounted && items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 border border-border rounded-lg p-3 bg-card">
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                        onClick={() => handleProductSelect(item.product)}
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border transition-opacity group-hover:opacity-80">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 transition-opacity group-hover:opacity-80">
                          <h4 className="font-medium text-foreground truncate leading-snug">{item.product.name}</h4>
                          <div className="font-bold mt-1">{item.product.price} сом</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="font-medium w-6 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                        <Dialog>
                          <DialogTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1")}>
                            <Trash2 className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent showCloseButton={false} className="w-[calc(100%-2rem)] max-w-md rounded-xl p-4 gap-4 bg-background shadow-xl border overflow-hidden">
                            <DialogClose className="absolute right-4 top-4 h-7 w-7 rounded-md bg-neutral-100 hover:bg-neutral-200 border-0 p-0 text-neutral-500 hover:text-neutral-700 mt-0 flex items-center justify-center transition-colors">
                              <X className="h-4 w-4" />
                            </DialogClose>
                            
                            <DialogHeader className="text-left space-y-2 pr-8">
                              <DialogTitle className="font-heading text-base leading-none font-medium">Удалить товар?</DialogTitle>
                            </DialogHeader>
                            
                            <DialogDescription asChild>
                              <div className="text-sm text-muted-foreground">
                                Вы уверены, что хотите удалить <span className="font-bold text-foreground">{item.product.name}</span> из заказа? Это действие пересчитает общую сумму.
                              </div>
                            </DialogDescription>
                            
                            <DialogFooter className="-mx-4 -mb-4 mt-2 flex flex-row justify-end gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:space-x-0">
                              <DialogClose className={cn(buttonVariants({ variant: "outline" }), "mt-0 flex-1 sm:flex-none bg-background")}>
                                Отмена
                              </DialogClose>
                              <Button onClick={() => removeItem(item.product.id)} className="flex-1 sm:flex-none bg-[#EF4444] text-white hover:bg-[#EF4444]/90 shadow-none">
                                Удалить
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Товары ({mounted ? totalItemsCount : 0})</span>
                  <span>{mounted ? itemsTotal : 0} сом</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>{mounted ? (deliveryMethod === "pickup" ? "Бесплатно" : (deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} сом`)) : "Бесплатно"}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t font-bold text-xl">
                  <span>Итого к оплате</span>
                  <span>{mounted ? finalTotal : 0} сом</span>
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
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="gap-3">
                <div className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${deliveryMethod === "pickup" ? "bg-[#8DC63F]/[0.08] border-[#8DC63F]" : "border-border hover:bg-muted/50"}`} onClick={() => setDeliveryMethod("pickup")}>
                  <RadioGroupItem value="pickup" id="pickup" className={`mt-0.5 ${deliveryMethod === "pickup" ? "border-[#8DC63F] text-[#8DC63F]" : ""}`} />
                  <div className="grid gap-1.5">
                    <Label htmlFor="pickup" className="font-medium cursor-pointer text-[15px] leading-none text-foreground">Самовывоз из магазина</Label>
                    <p className="text-[14px] text-muted-foreground">{DELIVERY_SETTINGS.pickup.address}</p>
                  </div>
                </div>
                
                <div className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${deliveryMethod === "delivery" ? "bg-[#8DC63F]/[0.08] border-[#8DC63F]" : "border-border hover:bg-muted/50"}`} onClick={() => setDeliveryMethod("delivery")}>
                  <RadioGroupItem value="delivery" id="delivery" className={`mt-0.5 ${deliveryMethod === "delivery" ? "border-[#8DC63F] text-[#8DC63F]" : ""}`} />
                  <div className="grid gap-1.5">
                    <Label htmlFor="delivery" className="font-medium cursor-pointer text-[15px] leading-none text-foreground">Доставка курьером</Label>
                    <p className="text-[14px] text-muted-foreground">
                      Стоимость: {DELIVERY_SETTINGS.courier.price} сом. Бесплатно при заказе от {DELIVERY_SETTINGS.courier.freeThreshold} сом.
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${deliveryMethod === "info" ? "bg-[#8DC63F]/[0.08] border-[#8DC63F]" : "border-border hover:bg-muted/50"}`} onClick={() => setDeliveryMethod("info")}>
                  <RadioGroupItem value="info" id="info" className={`mt-0.5 ${deliveryMethod === "info" ? "border-[#8DC63F] text-[#8DC63F]" : ""}`} />
                  <div className="grid gap-1.5">
                    <Label htmlFor="info" className="font-medium cursor-pointer text-[15px] leading-none text-foreground">Нужна дополнительная информация</Label>
                    <p className="text-[14px] text-muted-foreground">Свяжитесь с нами через WhatsApp</p>
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
                <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+996 500 000 000" />
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

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3 mt-4 mb-2">
              <Checkbox 
                id="terms" 
                checked={agreed} 
                onCheckedChange={(checked) => setAgreed(checked as boolean)} 
                className="mt-0.5 data-[state=checked]:bg-[#8DC63F] data-[state=checked]:border-[#8DC63F]" 
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-[14.5px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer"
                >
                  Я согласен с условиями
                </label>
                <p className="text-[13px] text-muted-foreground leading-snug">
                  Оформляя заказ, вы принимаете{" "}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <button className="underline underline-offset-4 hover:text-foreground transition-colors cursor-pointer text-left">Пользовательское соглашение</button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="max-w-[820px] mx-auto w-full px-4 pt-2 pb-8 h-[85vh] flex flex-col">
                        <DrawerHeader className="px-0 text-left">
                          <DrawerTitle className="text-xl font-bold">Пользовательское соглашение</DrawerTitle>
                        </DrawerHeader>
                        <div className="flex-1 overflow-y-auto pr-2 text-[14.5px] text-muted-foreground leading-relaxed mt-2 text-left">
                          <p className="mb-4">Настоящее соглашение определяет условия использования сайта {STORE_INFO.name} и предоставления услуг покупки товаров.</p>
                          <h4 className="font-semibold text-foreground mb-1 mt-6">1. Общие положения</h4>
                          <p className="mb-4">Сайт предоставляет пользователям доступ к информации о товарах, их характеристиках и возможности оформления заказа. Оформляя заказ, вы соглашаетесь с условиями данного соглашения.</p>
                          <h4 className="font-semibold text-foreground mb-1 mt-6">2. Оформление заказа</h4>
                          <p className="mb-4">Продавец обязуется передать покупателю товар, соответствующий описанию на сайте. Покупатель обязуется оплатить и принять товар в соответствии с выбранным способом доставки и оплаты.</p>
                          <h4 className="font-semibold text-foreground mb-1 mt-6">3. Гарантии и возврат</h4>
                          <p className="mb-4">На все товары предоставляется официальная гарантия. Возврат или обмен товара надлежащего качества возможен в течение 14 дней с момента покупки, при условии сохранения товарного вида и чека.</p>
                        </div>
                        <DrawerFooter className="px-0 pt-6 pb-0">
                          <DrawerClose asChild>
                            <Button variant="outline" className="w-full h-[46px] rounded-xl font-medium shadow-none">Закрыть</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>
                  {" "}и соглашаетесь с{" "}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <button className="underline underline-offset-4 hover:text-foreground transition-colors cursor-pointer text-left">Политикой конфиденциальности</button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="max-w-[820px] mx-auto w-full px-4 pt-2 pb-8 h-[85vh] flex flex-col">
                        <DrawerHeader className="px-0 text-left">
                          <DrawerTitle className="text-xl font-bold">Политика конфиденциальности</DrawerTitle>
                        </DrawerHeader>
                        <div className="flex-1 overflow-y-auto pr-2 text-[14.5px] text-muted-foreground leading-relaxed mt-2 text-left">
                          <p className="mb-4">Настоящая Политика конфиденциальности описывает, как {STORE_INFO.name} собирает, использует и защищает вашу личную информацию.</p>
                          <h4 className="font-semibold text-foreground mb-1 mt-6">1. Сбор информации</h4>
                          <p className="mb-4">Мы собираем информацию, которую вы предоставляете при оформлении заказа: имя, номер телефона, адрес доставки. Эта информация необходима исключительно для обработки и доставки вашего заказа.</p>
                          <h4 className="font-semibold text-foreground mb-1 mt-6">2. Использование данных</h4>
                          <p className="mb-4">Ваши данные используются для обратной связи, подтверждения заказа и улучшения качества нашего сервиса. Мы не передаем вашу личную информацию третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.</p>
                          <h4 className="font-semibold text-foreground mb-1 mt-6">3. Защита данных</h4>
                          <p className="mb-4">Мы принимаем необходимые организационные и технические меры для защиты вашей персональной информации от неправомерного доступа, уничтожения, изменения или блокирования.</p>
                        </div>
                        <DrawerFooter className="px-0 pt-6 pb-0">
                          <DrawerClose asChild>
                            <Button variant="outline" className="w-full h-[46px] rounded-xl font-medium shadow-none">Закрыть</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-[#F4F4F5] via-[#F4F4F5] to-transparent z-40 pb-safe pointer-events-none">
        <div className="max-w-[820px] mx-auto px-4 pointer-events-auto">
          <Button 
            size="lg"
            onClick={handleSubmit}
            className={`w-full text-base font-semibold shadow-lg shadow-black/5 flex justify-center items-center transition-colors ${
              isValid 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Оформить заказ на {mounted ? finalTotal : 0} сом
          </Button>
        </div>
      </div>

      {selectedProduct && (
        <ProductDrawer 
          product={selectedProduct} 
          open={isProductDrawerOpen} 
          onOpenChange={setIsProductDrawerOpen} 
          hideAddToCart={true}
        />
      )}
    </main>
  )
}
