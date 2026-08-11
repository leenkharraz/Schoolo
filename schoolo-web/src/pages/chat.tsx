import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { MessageSquare, Send, Trash2, Bot, User as UserIcon, RefreshCcw, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SCHOOLS, School } from "@/data/schools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Chat() {
  const { user, chatMessages, addChatMessage, clearChat } = useApp();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        id: "msg-welcome",
        role: "assistant",
        content: `Hello ${user.name.split(' ')[0] || "there"}! I'm your Skoolu AI Advisor. How can I help you find the perfect school today?`,
        timestamp: Date.now()
      });
    }
  }, []);

  const processResponse = (text: string) => {
    const query = text.toLowerCase();
    let response = "";
    
    // Rule-based logic
    if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      response = "Hello! I can help you find schools based on budget, curriculum, location, or special requirements. What are you looking for?";
    } 
    else if (query.includes("budget") || query.includes("cheap") || query.includes("affordable") || query.includes("price")) {
      const budgetSchools = SCHOOLS.filter(s => s.fees.tuition <= user.budgetMax)
                                   .sort((a,b) => a.fees.tuition - b.fees.tuition)
                                   .slice(0, 3);
      if (budgetSchools.length > 0) {
        response = `Here are some schools within your budget of ${user.budgetMax.toLocaleString()} SAR:\n\n` + 
                   budgetSchools.map(s => `• **${s.name}**: ${s.fees.tuition.toLocaleString()} SAR`).join("\n");
      } else {
        response = "I couldn't find any schools within your current budget setting. Try increasing it in your Profile preferences.";
      }
    }
    else if (query.includes("british") || query.includes("american") || query.includes("ib")) {
      const curr = query.includes("british") ? "British" : query.includes("american") ? "American" : "IB";
      const currSchools = SCHOOLS.filter(s => s.curriculum.toLowerCase().includes(curr.toLowerCase())).slice(0, 3);
      
      if (currSchools.length > 0) {
        response = `Here are top ${curr} curriculum schools:\n\n` + 
                   currSchools.map(s => `• **${s.name}** in ${s.location.city} (${s.rating}★)`).join("\n");
      } else {
        response = `I couldn't find any ${curr} curriculum schools right now.`;
      }
    }
    else if (query.includes("special needs") || query.includes("disability") || query.includes("support")) {
      const senSchools = SCHOOLS.filter(s => s.specialNeeds).slice(0, 3);
      response = "These schools offer dedicated special educational needs (SEN) support:\n\n" + 
                 senSchools.map(s => `• **${s.name}**`).join("\n");
    }
    else if (query.includes("sibling") || query.includes("discount")) {
      const sibSchools = SCHOOLS.filter(s => s.siblingsDiscount)
                                .sort((a,b) => b.siblingsDiscountPercent - a.siblingsDiscountPercent)
                                .slice(0, 3);
      response = "These schools offer great sibling discounts:\n\n" + 
                 sibSchools.map(s => `• **${s.name}**: ${s.siblingsDiscountPercent}% off`).join("\n");
    }
    else if (query.includes("nearest") || query.includes("close") || query.includes("near")) {
      const nearSchools = [...SCHOOLS].sort((a,b) => a.location.distance - b.location.distance).slice(0, 3);
      response = "Here are the schools closest to your area:\n\n" + 
                 nearSchools.map(s => `• **${s.name}**: ${s.location.distance}km away`).join("\n");
    }
    else if (query.includes("top") || query.includes("best") || query.includes("rated")) {
      const topSchools = [...SCHOOLS].sort((a,b) => b.rating - a.rating).slice(0, 3);
      response = "Here are the highest-rated schools on Skoolu:\n\n" + 
                 topSchools.map(s => `• **${s.name}**: ${s.rating}★ (${s.totalRatings} reviews)`).join("\n");
    }
    else if (query.includes("riyadh") || query.includes("jeddah") || query.includes("dammam")) {
      const city = query.includes("riyadh") ? "Riyadh" : query.includes("jeddah") ? "Jeddah" : "Dammam";
      const citySchools = SCHOOLS.filter(s => s.location.city === city).slice(0, 3);
      response = `Here are some options in ${city}:\n\n` + 
                 citySchools.map(s => `• **${s.name}**`).join("\n");
    }
    else if (query.includes("visit") || query.includes("tour") || query.includes("book")) {
      response = "You can schedule a school visit directly from any school's detail page! Just click 'Schedule a Visit' to choose an available date and time.";
    }
    else if (query.includes("apply") || query.includes("application")) {
      response = "Application processes vary by school. We recommend booking a visit first. Some schools like American International School Riyadh have applications open now for the next academic year.";
    }
    else {
      response = "I can help you find schools matching specific criteria. Try asking for 'budget friendly schools', 'British curriculum', 'schools with sibling discounts', or 'top rated in Riyadh'.";
    }

    return response;
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    // Add user message
    addChatMessage({
      id: `msg-u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now()
    });
    
    setInput("");
    setIsTyping(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsTyping(false);
      const response = processResponse(text);
      addChatMessage({
        id: `msg-a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: Date.now()
      });
    }, 1000 + Math.random() * 1000);
  };

  const quickReplies = [
    "Find schools in my budget",
    "British curriculum",
    "Special needs support",
    "Top-rated schools",
    "Nearest to me"
  ];

  const renderContent = (content: string) => {
    // Simple markdown-like bold rendering for "**text**"
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return (
      <span className="whitespace-pre-wrap leading-relaxed">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] w-full max-w-4xl mx-auto rounded-xl border bg-card shadow-sm overflow-hidden">
      
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">AI Advisor</h1>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-destructive">
          <RefreshCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        <div className="space-y-6">
          {chatMessages.length === 0 && !isTyping ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-8 opacity-50">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">Start a conversation</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Ask about curriculums, budgets, or specific facilities to find the right school.
              </p>
            </div>
          ) : (
            chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="h-8 w-8 shrink-0 border border-primary/20">
                    {msg.role === 'assistant' ? (
                      <AvatarFallback className="bg-primary/20 text-primary"><Sparkles className="h-4 w-4" /></AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {user.name ? user.name.substring(0,2).toUpperCase() : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm' 
                      : 'bg-card border text-foreground rounded-tl-none shadow-sm'
                  }`}>
                    <div className="text-sm">{renderContent(msg.content)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0 border border-primary/20">
                  <AvatarFallback className="bg-primary/20 text-primary"><Sparkles className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-tl-none bg-card border px-4 py-4 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        {chatMessages.length <= 2 && !isTyping && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {quickReplies.map(reply => (
              <Button 
                key={reply} 
                variant="outline" 
                size="sm" 
                className="shrink-0 rounded-full bg-background"
                onClick={() => handleSend(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
        
        <form 
          className="flex items-center gap-2" 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-background h-12 rounded-full px-4"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-12 w-12 shrink-0 rounded-full"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
