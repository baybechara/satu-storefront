"use client"

import { useState, useEffect, Suspense } from "react"
import { Phone, ChevronDown, ChevronUp, Smartphone, PhoneCall, MapPin, Menu, MessageCircle, X, Camera, Send } from "lucide-react"
import Image from "next/image"
import { ProductDrawer } from "@/components/ProductDrawer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCartStore } from "@/store/useCartStore"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

const IconInstagram = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const IconTelegram = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
)

const IconWhatsApp = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>
  </svg>
)

const STORE_INFO = {
  name: "Beko Kyrgyzstan",
  description: "Официальный магазин бытовой техники Beko. Широкий ассортимент качественной продукции для дома. Мы предоставляем гарантию 2 года на все товары и бесплатную доставку по Бишкеку.",
  shortDescription: "Официальный магазин бытовой техники Beko.",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
  phone: "+996 503 310 794",
  address: "г. Бишкек, ул. Примерная, 123",
  workingHours: [
    { day: "Пн", hours: "08:00 - 19:00", active: true },
    { day: "Вт", hours: "08:00 - 19:00", active: true },
    { day: "Ср", hours: "08:00 - 19:00", active: true },
    { day: "Чт", hours: "08:00 - 19:00", active: true },
    { day: "Пт", hours: "выходной", active: false },
    { day: "Сб", hours: "выходной", active: false },
    { day: "Вс", hours: "08:00 - 19:00", active: true },
  ]
}

const groupWorkingHours = (hours: any[]) => {
  if (!hours || hours.length === 0) return []
  const groups: any[] = []
  let currentGroup: any = null
  for (let i = 0; i < hours.length; i++) {
    const day = hours[i]
    const isSame = currentGroup && currentGroup.active === day.active && currentGroup.hours === day.hours
    if (isSame) {
      currentGroup.endDay = day.day
    } else {
      currentGroup = {
        startDay: day.day,
        endDay: day.day,
        active: day.active,
        hours: day.active ? day.hours : 'Выходной',
      }
      groups.push(currentGroup)
    }
  }
  return groups.map((g: any) => ({
    label: g.startDay === g.endDay ? g.startDay : `${g.startDay} - ${g.endDay}`,
    hours: g.hours,
    active: g.active
  }))
}

const GROUPED_HOURS = groupWorkingHours(STORE_INFO.workingHours)

const CATEGORIES = ["Все", "Соковыжималки", "Утюги", "Холодильники", "Стиральные машины", "Микроволновки"]

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Утюг Beko SIM3122T",
    price: 2884,
    category: "Утюги",
    images: [
      "https://picsum.photos/seed/iron1/600/600",
      "https://picsum.photos/seed/iron2/600/600"
    ],
    features: ["Тип: Утюг", "Мощность: 2300 Вт", "Покрытие: Керамика", "Пар: 120 г/мин"],
    description: "Мощный утюг с керамической подошвой для легкого скольжения и эффективного разглаживания складок. Оснащен функцией самоочистки и защитой от накипи."
  },
  {
    id: 2,
    name: "Соковыжималка Beko CJB6100W",
    price: 3450,
    category: "Соковыжималки",
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=600&fit=crop"
    ],
    features: ["Тип: Цитрус-пресс", "Мощность: 40 Вт", "Объем: 1 л", "Реверс: Есть"],
    description: "Компактная соковыжималка для цитрусовых. Два конуса для разных размеров фруктов, вращение в обе стороны для максимального отжима."
  },
  {
    id: 3,
    name: "Утюг Beko SIM3124D",
    price: 3100,
    category: "Утюги",
    images: [
      "https://picsum.photos/seed/iron3/600/600"
    ],
    features: ["Тип: Утюг", "Мощность: 2400 Вт", "Покрытие: Керамика"],
    description: "Современный утюг для дома. Отлично справляется с любыми тканями."
  },
  {
    id: 4,
    name: "Микроволновая печь Beko MOC20100W",
    price: 6500,
    category: "Микроволновки",
    images: [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&h=600&fit=crop"
    ],
    features: ["Объем: 20 л", "Мощность: 700 Вт", "Управление: Механическое"],
    description: "Простая и надежная микроволновая печь для быстрого разогрева и разморозки продуктов."
  },
  {
    id: 5,
    name: "Холодильник Beko RCNK270K20W",
    price: 32500,
    category: "Холодильники",
    images: [
      "https://picsum.photos/seed/fridge1/600/600"
    ],
    features: ["Система: No Frost", "Объем: 270 л", "Энергопотребление: A+"],
    description: "Вместительный холодильник с системой No Frost. Забудьте о разморозке, продукты дольше остаются свежими."
  },
  {
    id: 6,
    name: "Стиральная машина Beko WSPE6612W",
    price: 24900,
    category: "Стиральные машины",
    images: [
      "https://picsum.photos/seed/washer1/600/600"
    ],
    features: ["Загрузка: 6 кг", "Отжим: 1200 об/мин", "Мотор: Инверторный"],
    description: "Узкая стиральная машина с инверторным мотором ProSmart. Тихая работа, экономия энергии и бережная стирка."
  }
]

function Storefront() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')

  const [activeCategory, setActiveCategory] = useState("Все")
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const selectedProduct = productId ? MOCK_PRODUCTS.find(p => p.id === Number(productId)) || null : null

  const handleProductSelect = (product: any) => {
    router.push(`${pathname}?product=${product.id}`, { scroll: false })
  }

  const handleDrawerClose = (open: boolean) => {
    if (!open) {
      router.push(pathname, { scroll: false })
    }
  }

  const totalItems = useCartStore((state) => state.totalItems())
  const totalPrice = useCartStore((state) => state.totalPrice())

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    try {
      const bishkekTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bishkek" }))
      const day = bishkekTime.getDay()
      const bishkekHour = bishkekTime.getHours()
      const bishkekMinute = bishkekTime.getMinutes()
      const currentMins = bishkekHour * 60 + bishkekMinute
      
      const idx = (day + 6) % 7
      const todaySchedule = STORE_INFO.workingHours[idx]
      
      if (!todaySchedule.active) {
        setIsOpen(false)
      } else {
        const [start, end] = todaySchedule.hours.split(" - ")
        const [startH, startM] = start.split(":").map(Number)
        const [endH, endM] = end.split(":").map(Number)
        setIsOpen(currentMins >= (startH * 60 + startM) && currentMins < (endH * 60 + endM))
      }
    } catch(e) {}
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const filteredProducts = activeCategory === "Все" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <main className="min-h-screen pb-28 pt-[74px] max-w-[820px] mx-auto relative">
      {/* Store Header (Fixed) */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#F4F4F5] ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className={`flex justify-between items-start max-w-[820px] mx-auto px-4`}>
          <div className={`relative rounded-full overflow-hidden border border-border/50 shrink-0 transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-[42px] h-[42px]'}`}>
            <Image src={STORE_INFO.logo} alt="Logo" fill className="object-cover" />
          </div>
          {/* Action Bar */}
          <div className={`flex items-stretch bg-background border border-border/60 rounded-md overflow-hidden shrink-0 transition-all duration-300 ${isScrolled ? 'h-8' : 'h-[42px]'}`}>
            <Dialog>
              <DialogTrigger className={`flex items-center justify-center gap-2 hover:bg-muted transition-colors border-r border-border/60 text-sm font-semibold h-full ${isScrolled ? 'px-3' : 'px-4 sm:px-3'}`}>
                <PhoneCall className={isScrolled ? "w-4 h-4" : "w-[18px] h-[18px]"} strokeWidth={2} />
                {!isScrolled && <span className="hidden sm:inline tracking-tight">{STORE_INFO.phone}</span>}
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="w-[calc(100%-2rem)] max-w-md rounded-xl p-4 gap-4 bg-background shadow-xl border overflow-hidden">
                <DialogClose className="absolute right-4 top-4 h-7 w-7 rounded-md bg-neutral-100 hover:bg-neutral-200 border-0 p-0 text-neutral-500 hover:text-neutral-700 mt-0 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4" />
                </DialogClose>
                <DialogHeader className="text-left space-y-2 pr-8 p-0">
                  <DialogTitle className="font-heading text-base leading-none font-medium">Связь с нами</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col mt-1">
                  <a href={`tel:${STORE_INFO.phone.replace(/\s/g, '')}`} className="flex items-center gap-4 py-3.5 border-b border-border/50 hover:bg-muted/30 transition-colors -mx-4 px-4">
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-muted/80 text-foreground flex items-center justify-center shrink-0">
                      <Phone className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-muted-foreground">Основной номер</span>
                      <span className="font-medium text-[15px] leading-snug text-foreground mt-0.5">{STORE_INFO.phone}</span>
                    </div>
                  </a>
                  
                  <a href={`tel:+996555123456`} className="flex items-center gap-4 py-3.5 border-b border-border/50 hover:bg-muted/30 transition-colors -mx-4 px-4">
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-muted/80 text-foreground flex items-center justify-center shrink-0">
                      <Phone className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-muted-foreground">Дополнительный (Megacom)</span>
                      <span className="font-medium text-[15px] leading-snug text-foreground mt-0.5">+996 555 123 456</span>
                    </div>
                  </a>
                  
                  <a href={`https://wa.me/${STORE_INFO.phone.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-4 py-3.5 hover:bg-muted/30 transition-colors -mx-4 px-4">
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-muted/80 text-foreground flex items-center justify-center shrink-0">
                      <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-muted-foreground">Написать в WhatsApp</span>
                      <span className="font-medium text-[15px] leading-snug text-foreground mt-0.5">{STORE_INFO.phone}</span>
                    </div>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger className={`flex items-center justify-center h-full hover:bg-muted transition-colors border-r border-border/60 ${isScrolled ? 'px-3' : 'px-4'}`}>
                <MapPin className={isScrolled ? "w-4 h-4" : "w-[18px] h-[18px]"} strokeWidth={2} />
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="w-[calc(100%-2rem)] max-w-md rounded-xl p-0 gap-0 bg-background shadow-xl border overflow-hidden">
                <DialogClose className="absolute right-4 top-4 h-7 w-7 rounded-md bg-neutral-100 hover:bg-neutral-200 border-0 p-0 text-neutral-500 hover:text-neutral-700 mt-0 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4" />
                </DialogClose>
                
                <div className="flex flex-col items-center text-center p-8 pt-10 pb-8">
                  <div className="w-[42px] h-[42px] rounded-[12px] bg-muted/80 text-foreground flex items-center justify-center mb-5">
                    <MapPin className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="font-semibold text-[17px] text-foreground mb-2">Наш адрес</h3>
                  
                  <div className="w-full text-[14px] mb-8 flex flex-col items-center">
                    <p className="text-muted-foreground mb-6">{STORE_INFO.address}</p>
                    
                    <div className="w-full flex flex-col items-start">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-background shadow-sm mb-3">
                        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[#2EA043]' : 'bg-red-500'}`} />
                        <span className="text-[13px] font-medium text-foreground leading-none mt-[1px]">{isOpen ? 'Сейчас открыто' : 'Закрыто'}</span>
                      </div>
                      
                      <div className="flex flex-col w-full text-left bg-muted/40 rounded-[14px] border border-border/50">
                        {GROUPED_HOURS.map((group, i) => (
                          <div key={i} className={`flex justify-between items-center text-[13.5px] px-4 py-3 ${i !== GROUPED_HOURS.length - 1 ? 'border-b border-border/50' : ''}`}>
                            <span className="text-muted-foreground">{group.label}</span>
                            <span className={group.active ? "text-foreground font-medium" : "text-muted-foreground"}>{group.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full sm:w-auto min-w-[180px] bg-[#84cc16] hover:bg-[#65a30d] text-white font-medium rounded-md h-9 px-4 mb-4 shadow-none">
                    Открыть в 2ГИС
                  </Button>
                  
                  <a href="#" className="text-[13px] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Показать на карте
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button className={`flex items-center justify-center h-full hover:bg-muted transition-colors ${isScrolled ? 'px-3' : 'px-4'}`}>
                  <Menu className={isScrolled ? "w-4 h-4" : "w-[18px] h-[18px]"} strokeWidth={2} />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#F9F9FB]">
                <div className="w-full flex flex-col h-full">
                  <DrawerHeader className="text-left mt-2 pb-0">
                    <DrawerTitle className="text-xl font-bold">Меню</DrawerTitle>
                    <DrawerDescription className="text-[15px]">Навигация по магазину и информация.</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 py-4 flex flex-col flex-1 overflow-y-auto">
                    <Accordion className="w-full">
                      <AccordionItem value="catalog" className="border-border/50">
                        <AccordionTrigger className="text-[16px] font-medium hover:no-underline">Каталог товаров</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 pt-2 pb-1">
                            {CATEGORIES.map((cat, i) => (
                              <DrawerClose asChild key={i}>
                                <button 
                                  className={`flex items-center h-[42px] px-4 rounded-md transition-all border font-medium text-left text-[14px] ${activeCategory === cat ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50 border-border/60 bg-background text-foreground'}`}
                                  onClick={() => {
                                    setActiveCategory(cat)
                                  }}
                                >
                                  {cat}
                                </button>
                              </DrawerClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="about" className="border-border/50">
                        <AccordionTrigger className="text-[16px] font-medium hover:no-underline">О нас</AccordionTrigger>
                        <AccordionContent className="text-[14.5px] text-muted-foreground leading-relaxed pt-1 pb-3">
                          {STORE_INFO.description}
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="payment" className="border-border/50">
                        <AccordionTrigger className="text-[16px] font-medium hover:no-underline">Оплата</AccordionTrigger>
                        <AccordionContent className="text-[14.5px] text-muted-foreground leading-relaxed pt-1 pb-3">
                          Мы принимаем наличные, банковские карты (Visa, MasterCard, Элкарт), а также переводы через мобильные банкинги (MBank, Optima24, O!Деньги). Возможна покупка в рассрочку.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="delivery" className="border-border/50 border-b-0">
                        <AccordionTrigger className="text-[16px] font-medium hover:no-underline">Доставка</AccordionTrigger>
                        <AccordionContent className="text-[14.5px] text-muted-foreground leading-relaxed pt-1 pb-3">
                          Доставка по городу Бишкек осуществляется бесплатно при заказе от 5000 сом. При заказе на меньшую сумму стоимость доставки составляет 200 сом. В регионы отправляем через курьерские службы по их тарифам.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    {/* Socials */}
                    <div className="flex items-center justify-center gap-5 mt-auto pt-8 pb-2">
                      <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-border/60 bg-background hover:bg-muted transition-all text-foreground shadow-sm hover:scale-105 active:scale-95">
                        <IconInstagram className="w-[22px] h-[22px]" strokeWidth={1.5} />
                      </a>
                      <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-border/60 bg-background hover:bg-muted transition-all text-foreground shadow-sm hover:scale-105 active:scale-95">
                        <IconTelegram className="w-[22px] h-[22px] ml-[-2px] mt-[2px]" strokeWidth={1.5} />
                      </a>
                      <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-border/60 bg-background hover:bg-muted transition-all text-foreground shadow-sm hover:scale-105 active:scale-95">
                        <IconWhatsApp className="w-[22px] h-[22px]" strokeWidth={1.5} />
                      </a>
                    </div>
                  </div>
                  <DrawerFooter className="pt-2 pb-8">
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full h-[46px] rounded-xl font-medium shadow-none bg-background">Закрыть</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="px-4 pt-2 pb-2 relative z-20">
        
        <h1 className="text-2xl font-bold mb-1">{STORE_INFO.name}</h1>
        
        <div className="text-sm text-muted-foreground transition-all">
          {showFullDesc ? STORE_INFO.description : STORE_INFO.shortDescription}
        </div>
        
        <Button 
          variant="link"
          className="p-0 h-auto mt-2 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => setShowFullDesc(!showFullDesc)}
        >
          {showFullDesc ? "Скрыть" : "Подробнее"}
          {showFullDesc ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </Button>
      </div>

      <div className="sticky top-[48px] z-30 pt-3 pb-6 bg-gradient-to-b from-[#F4F4F5] via-[#F4F4F5]/95 to-transparent">
        <div className="flex overflow-x-auto snap-x scrollbar-hide px-4 gap-2 pb-1">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={`snap-center whitespace-nowrap font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-foreground text-background border-transparent hover:bg-foreground/90' 
                  : 'bg-background hover:bg-muted/50 text-muted-foreground'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 py-4 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 relative z-0">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => handleProductSelect(product)}
            className="bg-card text-card-foreground rounded-2xl p-3 cursor-pointer flex flex-col transition-all active:scale-[0.98]"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted mb-2.5">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium line-clamp-2 leading-snug text-foreground/90">
                {product.name}
              </h3>
              <div className="mt-1">
                <span className="font-bold text-[17px]">{product.price} сом</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 mb-4 pt-8 pb-6 px-4 border-t border-border/50 flex flex-col items-center justify-center text-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-[13px] text-muted-foreground font-medium">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="hover:text-foreground transition-colors underline-offset-4 hover:underline">Политика конфиденциальности</button>
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
          </Drawer>

          <Drawer>
            <DrawerTrigger asChild>
              <button className="hover:text-foreground transition-colors underline-offset-4 hover:underline">Пользовательское соглашение</button>
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
        </div>
        <div className="text-[12px] text-muted-foreground/70">
          © {new Date().getFullYear()} {STORE_INFO.name}. Все права защищены.
        </div>
        <div className="mt-2">
          <a href="https://satu.kg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/50 hover:bg-muted px-4 py-2 rounded-full border border-border/50">
            Сделано в <span className="font-bold tracking-tight text-foreground">Satu.kg</span>
          </a>
        </div>
      </footer>

      {/* Product Drawer */}
      <ProductDrawer 
        product={selectedProduct} 
        open={!!selectedProduct} 
        onOpenChange={handleDrawerClose} 
      />

      {/* Floating Cart Button */}
      {mounted && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-[#F4F4F5] via-[#F4F4F5] to-transparent z-40 pb-safe">
          <Link href="/checkout" className="block max-w-[820px] mx-auto px-4">
            <Button 
              size="lg" 
              className="w-full shadow-lg shadow-black/5 bg-foreground hover:bg-foreground/90 text-background flex justify-between items-center pl-[4px] pr-6"
            >
              <div className="bg-background/20 text-background h-[34px] px-3 text-sm rounded-[4px] flex items-center justify-center font-bold">
                {totalItems} шт.
              </div>
              <span className="font-semibold text-base">Корзина</span>
              <span className="font-bold">{totalPrice} сом</span>
            </Button>
          </Link>
        </div>
      )}
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<StorefrontSkeleton />}>
      <Storefront />
    </Suspense>
  )
}

function StorefrontSkeleton() {
  return (
    <div className="min-h-screen pb-28 pt-[74px] max-w-[820px] mx-auto relative bg-background">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#F4F4F5] py-4 border-b border-border/50">
        <div className="flex justify-between items-start max-w-[820px] mx-auto px-4">
          <Skeleton className="w-[42px] h-[42px] rounded-full" />
          <Skeleton className="w-[120px] h-[42px] rounded-md" />
        </div>
      </div>

      {/* Store Info Skeleton */}
      <div className="px-4 pt-2 pb-2 relative z-20 mt-4">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-1" />
        <Skeleton className="h-4 w-20 mt-3" />
      </div>

      {/* Categories Skeleton */}
      <div className="sticky top-[48px] z-30 pt-3 pb-6 bg-gradient-to-b from-[#F4F4F5] via-[#F4F4F5]/95 to-transparent">
        <div className="flex overflow-x-auto px-4 gap-2 pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md shrink-0" />
          ))}
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="px-4 py-4 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-3 flex flex-col border border-border/50">
            <Skeleton className="w-full aspect-square rounded-xl mb-2.5" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-5 w-1/2 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

