/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Item, ItemKeys } from "./table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Item) => void;
}

const init: Item = {
  ten_tai_san: "",
  nhom_tai_san: "",
  tai_san_co_cam_ket_mua_lai: false,
  key_tai_san: "",
  loai_co_phieu: "",
  loai_tai_san_lv1: "",
  loai_tai_san_lv2: "",
};

export function AddModal({ isOpen, onClose, onAdd }: AddModalProps) {
  const [state, setState] = useState<Item>(init);

  useEffect(() => {
    return () => {
      setState(init);
    };
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white w-[700px] max-w-none'>
        <DialogHeader>
          <DialogTitle>Thêm mới</DialogTitle>
        </DialogHeader>
        <div className='gap-4 py-4 grid  grid-cols-2'>
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
                      setState(
                        (old) =>
                          ({
                            ...old,
                            [itemKey]: checked,
                          } as any)
                      )
                    }
                  />
                ) : (
                  <Input
                    id={itemKey}
                    value={(state as any)[itemKey]}
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
            Hủy
          </Button>
          <Button onClick={() => onAdd(state)}>Thêm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
