import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Item, ItemKeys } from "./table";
import { Checkbox } from "@/components/ui/checkbox";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedData: Item) => void;
  initialData: Item;
}
export function EditModal({ isOpen, onClose, onSave, initialData }: EditModalProps) {
  const [state, setState] = useState<Item>(initialData);

  const handleSave = () => {
    onSave(state);
  };

  useEffect(() => {
    setState(initialData);
    return () => {};
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white  w-[700px] max-w-none'>
        <DialogHeader>
          <DialogTitle className=''>Edit</DialogTitle>
        </DialogHeader>
        <div className='gap-4 py-4 grid  grid-cols-2 '>
          {ItemKeys.map((itemKey) => {
            return (
              <div key={itemKey} className='grid   items-center gap-2'>
                <Label className='text-gray-700' htmlFor={itemKey}>
                  {itemKey}
                </Label>

                {itemKey === "tai_san_co_cam_ket_mua_lai" ? (
                  <Checkbox
                    id={itemKey}
                    checked={state[itemKey]}
                    onCheckedChange={(checked) =>
                      setState((old) => ({
                        ...old,
                        [itemKey]: checked,
                      }))
                    }
                  />
                ) : (
                  <Input
                    id={itemKey}
                    value={state[itemKey]}
                    disabled={itemKey === "key_tai_san"}
                    onChange={(e) =>
                      setState((old) => ({
                        ...old,
                        [itemKey]: e.target.value,
                      }))
                    }
                    // placeholder={itemKey}
                  />
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
