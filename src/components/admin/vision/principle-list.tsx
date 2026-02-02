"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPrinciple, updatePrinciple, deletePrinciple } from "@/app/actions/visions";
import type { VisionPrinciple } from "@prisma/client";
import { Plus, Edit, Trash2, Save, X, GripVertical } from "lucide-react";

interface PrincipleListProps {
  visionId: string;
  principles: VisionPrinciple[];
}

export function PrincipleList({ visionId, principles }: PrincipleListProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Weet je zeker dat je uitgangspunt "${title}" wilt verwijderen?`)) {
      return;
    }
    startTransition(async () => {
      await deletePrinciple(id);
    });
  };

  const handleSaveNew = async (formData: FormData) => {
    formData.set("visionId", visionId);
    startTransition(async () => {
      await createPrinciple({ success: false }, formData);
      setIsAdding(false);
    });
  };

  const handleSaveEdit = async (id: string, formData: FormData) => {
    startTransition(async () => {
      await updatePrinciple(id, { success: false }, formData);
      setEditingId(null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Uitgangspunten</h3>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Toevoegen
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {principles.map((principle) => (
          <div
            key={principle.id}
            className="rounded-lg border p-4"
          >
            {editingId === principle.id ? (
              <form
                action={(formData) => handleSaveEdit(principle.id, formData)}
                className="space-y-3"
              >
                <Input
                  name="title"
                  label="Titel"
                  defaultValue={principle.title}
                  required
                />
                <Textarea
                  name="description"
                  label="Beschrijving"
                  defaultValue={principle.description}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Annuleren
                  </Button>
                  <Button type="submit" size="sm" disabled={isPending}>
                    <Save className="mr-1 h-4 w-4" />
                    Opslaan
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 cursor-grab" />
                <div className="flex-1">
                  <h4 className="font-medium">{principle.title}</h4>
                  {principle.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {principle.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(principle.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(principle.id, principle.title)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <form
            action={handleSaveNew}
            className="rounded-lg border border-dashed p-4 space-y-3"
          >
            <Input
              name="title"
              label="Titel"
              placeholder="Geef het uitgangspunt een titel"
              required
              autoFocus
            />
            <Textarea
              name="description"
              label="Beschrijving"
              placeholder="Beschrijf het uitgangspunt..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                <X className="mr-1 h-4 w-4" />
                Annuleren
              </Button>
              <Button type="submit" size="sm" disabled={isPending}>
                <Plus className="mr-1 h-4 w-4" />
                Toevoegen
              </Button>
            </div>
          </form>
        )}

        {principles.length === 0 && !isAdding && (
          <div className="text-center py-8 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">Nog geen uitgangspunten gedefinieerd</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Eerste uitgangspunt toevoegen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
