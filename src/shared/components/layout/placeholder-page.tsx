import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Próximamente</CardTitle>
          <CardDescription>
            El módulo se implementará siguiendo <code className="text-xs">.agents/skills/</code> y{" "}
            <code className="text-xs">.agents/domain/</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Scaffold listo — Clean Architecture, Supabase y reglas de negocio documentadas.
        </CardContent>
      </Card>
    </div>
  );
}
