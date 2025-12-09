"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  chatService,
  type ChatMessagePayload,
  type ChatOrderSummary,
  type ChatProductSuggestion,
} from "@/services/chatService";
import { getOrderStatusLabel } from "@/types/order";
import { formatCurrency, formatOrderCode } from "@/utils";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  queryType?: string;
  products?: ChatProductSuggestion[];
  orders?: ChatOrderSummary[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: trimmedMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build recent history (last 4 messages)
      const history: ChatMessagePayload[] = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
        queryType: m.queryType,
        productIds: m.products?.map((p) => p.id) ?? [],
        orderIds: m.orders?.map((o) => o.id) ?? [],
        timestamp: m.timestamp.toISOString(),
      }));

      // Call chatbot API with message and history
      const response = await chatService.sendMessage({
        message: trimmedMessage,
        history,
      });

      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response.reply,
        sender: "bot",
        timestamp: new Date(response.timestamp),
        queryType: response.queryType,
        products: response.products ?? [],
        orders: response.orders ?? [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");

      // Add error message
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-[1000] h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-rose-600 transition-all duration-200",
          "hover:scale-105 hover:shadow-xl",
          isOpen && "bg-gray-900 hover:bg-gray-800",
        )}
        aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}
      >
        {isOpen ? (
          <X strokeWidth={3} className="size-5" />
        ) : (
          <MessageCircle strokeWidth={3} className="size-5" />
        )}
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-[999] w-[400px] h-[600px] bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
          "max-md:w-[calc(100vw-2rem)] max-md:h-[calc(100vh-8rem)] max-md:bottom-20 max-md:right-4",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-sm">Hỗ trợ tư vấn</h3>
              <p className="text-gray-500 text-xs">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            aria-label="Đóng chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
          <div className="p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
                <MessageCircle className="h-12 w-12 text-gray-300 mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Xin chào! Tôi có thể giúp gì cho bạn?
                </p>
                <p className="text-gray-500 text-xs">
                  Hỏi về sản phẩm, đơn hàng hoặc thông tin cửa hàng
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl px-4 py-3 break-words",
                        message.sender === "user"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200",
                      )}
                    >
                      {message.sender === "bot" ? (
                        <>
                          <div className="markdown-content text-sm leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.text}
                            </ReactMarkdown>
                          </div>

                          {message.products && message.products.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase">
                                Gợi ý sản phẩm
                              </p>
                              <div className="space-y-2">
                                {message.products.slice(0, 3).map((product) => (
                                  <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition hover:border-primary/40 hover:shadow-sm"
                                  >
                                    {product.thumbnailUrl ? (
                                      <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-100">
                                        <Image
                                          src={product.thumbnailUrl}
                                          alt={product.name}
                                          fill
                                          sizes="48px"
                                          className="object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-gray-200 text-xs text-gray-400">
                                        No img
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                        {product.name}
                                      </p>
                                      <p className="text-xs text-gray-500 line-clamp-1">
                                        {[product.brand, product.category]
                                          .filter(Boolean)
                                          .join(" • ")}
                                      </p>
                                      <div className="mt-1 flex items-center gap-2">
                                        <span className="text-sm font-bold text-primary">
                                          {formatCurrency(product.price)}
                                        </span>
                                        {product.originalPrice && (
                                          <span className="text-xs text-gray-400 line-through">
                                            {formatCurrency(product.originalPrice)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.orders && message.orders.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase">
                                Đơn hàng liên quan
                              </p>
                              <div className="space-y-2">
                                {message.orders.slice(0, 3).map((order) => (
                                  <Link
                                    key={order.id}
                                    href={`/profile/orders/${order.id}`}
                                    className="block rounded-lg border border-gray-200 bg-white p-3 transition hover:border-primary/40 hover:shadow-sm"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-semibold text-gray-900">
                                        Đơn {formatOrderCode(order.id)}
                                      </p>
                                      <span className="text-xs font-semibold text-gray-600">
                                        {getOrderStatusLabel(order.status?.toUpperCase())}
                                      </span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                                      <span>
                                        {new Date(order.orderedAt).toLocaleDateString("vi-VN")}
                                      </span>
                                      <span>{order.itemCount} sản phẩm</span>
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-primary">
                                      {formatCurrency(order.totalAmount)}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      )}
                      <p
                        className={cn(
                          "text-xs mt-2",
                          message.sender === "user" ? "text-white/70" : "text-gray-500",
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-xl rounded-bl-sm border border-gray-200 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-600">Đang trả lời...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Auto resize textarea
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
              }}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="min-h-[44px] max-h-32 rounded-full resize-none border-gray-200 focus:border-primary overflow-hidden"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-11 w-11 rounded-full bg-primary text-white hover:bg-rose-600 shrink-0"
              aria-label="Gửi tin nhắn"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
