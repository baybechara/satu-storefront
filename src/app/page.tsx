"use client"

import { useState, useEffect } from "react"
import { Phone, ChevronDown, ChevronUp, Smartphone, PhoneCall, MapPin, Menu } from "lucide-react"
import Image from "next/image"
import { ProductDrawer } from "@/components/ProductDrawer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const STORE_INFO = {
  name: "Beko Kyrgyzstan",
  description: "Официальный магазин бытовой техники Beko. Широкий ассортимент качественной продукции для дома. Мы предоставляем гарантию 2 года на все товары и бесплатную доставку по Бишкеку.",
  shortDescription: "Официальный магазин бытовой техники Beko.",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
  phone: "+996555123456"
}

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
  }
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Все")
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
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
          <div className={`flex items-center bg-background border border-border/60 rounded-md overflow-hidden shrink-0 transition-all duration-300 ${isScrolled ? 'h-8' : 'h-[42px]'}`}>
            <a href={`tel:${STORE_INFO.phone}`} className={`flex items-center justify-center gap-2 hover:bg-muted transition-colors border-r border-border/60 text-sm font-semibold h-full ${isScrolled ? 'px-3' : 'px-4 sm:px-3'}`}>
              <PhoneCall className={isScrolled ? "w-4 h-4" : "w-[18px] h-[18px]"} strokeWidth={2} />
              {!isScrolled && <span className="hidden sm:inline tracking-tight">{STORE_INFO.phone}</span>}
            </a>
            <button className={`flex items-center justify-center h-full hover:bg-muted transition-colors border-r border-border/60 ${isScrolled ? 'px-3' : 'px-4'}`}>
              <MapPin className={isScrolled ? "w-4 h-4" : "w-[18px] h-[18px]"} strokeWidth={2} />
            </button>
            <button className={`flex items-center justify-center h-full hover:bg-muted transition-colors ${isScrolled ? 'px-3' : 'px-4'}`}>
              <Menu className={isScrolled ? "w-4 h-4" : "w-[18px] h-[18px]"} strokeWidth={2} />
            </button>
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
            onClick={() => setSelectedProduct(product)}
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

      {/* Product Drawer */}
      <ProductDrawer 
        product={selectedProduct} 
        open={!!selectedProduct} 
        onOpenChange={(open) => !open && setSelectedProduct(null)} 
      />

      {/* Floating Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-[#F4F4F5] via-[#F4F4F5] to-transparent z-40 pb-safe">
        <Link href="/checkout" className="block max-w-[820px] mx-auto px-4">
          <Button 
            size="lg" 
            className="w-full shadow-lg shadow-black/5 bg-foreground hover:bg-foreground/90 text-background flex justify-between items-center pl-[4px] pr-6"
          >
            <div className="bg-background/20 text-background h-[34px] px-3 text-sm rounded-[4px] flex items-center justify-center font-bold">
              3 шт.
            </div>
            <span className="font-semibold text-base">Корзина</span>
            <span className="font-bold">{3450} сом</span>
          </Button>
        </Link>
      </div>
    </main>
  )
}

