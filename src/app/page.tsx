"use client"

import { useState } from "react"
import { Phone, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { ProductDrawer } from "@/components/ProductDrawer"
import { Button } from "@/components/ui/button"

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
  
  const filteredProducts = activeCategory === "Все" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <main className="min-h-screen pb-12">
      {/* Store Header */}
      <div className="px-4 pt-6 pb-2 relative z-20">
        <div className="flex justify-between items-start mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border/50">
            <Image src={STORE_INFO.logo} alt="Logo" fill className="object-cover" />
          </div>
          <Button 
            size="icon" 
            render={<a href={`tel:${STORE_INFO.phone}`} />}
            className="rounded-full h-12 w-12 shadow-sm bg-foreground text-background hover:bg-foreground/90"
          >
            <Phone className="w-5 h-5 fill-current" />
          </Button>
        </div>
        
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

      <div className="sticky top-0 z-10 pt-3 pb-3 bg-secondary/40 backdrop-blur-xl">
        <div className="flex overflow-x-auto snap-x scrollbar-hide px-4 gap-2 pb-1">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant="outline"
              className={`rounded-full snap-center whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-foreground text-background border-transparent hover:bg-foreground/90' 
                  : 'bg-background hover:bg-secondary/40'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3 relative z-0">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)}
            className="bg-card text-card-foreground rounded-[calc(var(--radius)*1.5)] p-3 cursor-pointer flex flex-col h-full transition-all active:scale-[0.98]"
          >
            <div className="relative w-full aspect-square rounded-[calc(var(--radius))] overflow-hidden bg-muted mb-3">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-2">
                {product.name}
              </h3>
              <div className="mt-auto pt-1">
                <span className="font-bold text-lg">{product.price} сом</span>
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
    </main>
  )
}
