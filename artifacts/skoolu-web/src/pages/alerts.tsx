import { Link } from "wouter";
import { Bell, Calendar, Clock, Star, DollarSign, CheckCircle2, Edit2, XCircle, ChevronRight } from "lucide-react";
import { useApp, Alert } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export default function Alerts() {
  const { alerts, markAlertRead } = useApp();

  const now = Date.now();
  const newAlerts = alerts.filter(a => (now - a.timestamp) < 86400000);
  const earlierAlerts = alerts.filter(a => (now - a.timestamp) >= 86400000);

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'open_day': return <div className="bg-green-100 text-green-600 p-2 rounded-full dark:bg-green-900/30"><Calendar className="h-5 w-5" /></div>;
      case 'deadline': return <div className="bg-red-100 text-red-600 p-2 rounded-full dark:bg-red-900/30"><Clock className="h-5 w-5" /></div>;
      case 'match': return <div className="bg-orange-100 text-orange-600 p-2 rounded-full dark:bg-orange-900/30"><Star className="h-5 w-5" /></div>;
      case 'fee_update': return <div className="bg-blue-100 text-blue-600 p-2 rounded-full dark:bg-blue-900/30"><DollarSign className="h-5 w-5" /></div>;
      case 'booking': return <div className="bg-teal-100 text-teal-600 p-2 rounded-full dark:bg-teal-900/30"><CheckCircle2 className="h-5 w-5" /></div>;
      case 'booking_update': return <div className="bg-amber-100 text-amber-600 p-2 rounded-full dark:bg-amber-900/30"><Edit2 className="h-5 w-5" /></div>;
      case 'booking_cancel': return <div className="bg-gray-100 text-gray-600 p-2 rounded-full dark:bg-gray-800/50"><XCircle className="h-5 w-5" /></div>;
      default: return <div className="bg-primary/10 text-primary p-2 rounded-full"><Bell className="h-5 w-5" /></div>;
    }
  };

  const formatTime = (ts: number) => {
    const diff = now - ts;
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return `${Math.floor(diff/86400000)}d ago`;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
        <p className="text-muted-foreground mt-1">Stay updated on deadlines, open days, and matches.</p>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-bold">All caught up!</h2>
          <p className="text-muted-foreground">You don't have any new alerts.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {newAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">New</h3>
              <div className="rounded-xl border bg-card overflow-hidden shadow-sm divide-y">
                {newAlerts.map(alert => (
                  <AlertItem 
                    key={alert.id} 
                    alert={alert} 
                    icon={getAlertIcon(alert.type)} 
                    time={formatTime(alert.timestamp)}
                    onClick={() => markAlertRead(alert.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {earlierAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Earlier</h3>
              <div className="rounded-xl border bg-card overflow-hidden shadow-sm divide-y">
                {earlierAlerts.map(alert => (
                  <AlertItem 
                    key={alert.id} 
                    alert={alert} 
                    icon={getAlertIcon(alert.type)} 
                    time={formatTime(alert.timestamp)}
                    onClick={() => markAlertRead(alert.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AlertItem({ alert, icon, time, onClick }: { alert: Alert, icon: any, time: string, onClick: () => void }) {
  const content = (
    <div className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${!alert.read ? 'bg-primary/5' : ''}`} onClick={onClick}>
      <div className="shrink-0 pt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className={`text-sm font-semibold leading-tight ${!alert.read ? 'text-foreground' : 'text-muted-foreground'}`}>
            {alert.title}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{alert.body}</p>
      </div>
      {alert.schoolId && (
        <div className="shrink-0 flex items-center h-full pt-3">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );

  return alert.schoolId ? (
    <Link href={`/schools/${alert.schoolId}`} className="block" onClick={onClick}>
      {content}
    </Link>
  ) : (
    <div className="cursor-pointer">{content}</div>
  );
}
