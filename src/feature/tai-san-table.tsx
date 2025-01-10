/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
const initData: TaiSanItem[] = [];
export const endpoint =
  "https://api.fabric.microsoft.com/v1/workspaces/836c7159-00d0-4a0c-af5e-c76cd38c1444/graphqlapis/31cc3dac-c61e-4ea1-a065-893e3f1ae2c1/graphql";
type TaiSanItem = {
  ma_tai_san: string;
  ten_tai_san: string;
  nhom_tai_san: string;
  loai_tai_san_lv1: string;
  loai_tai_san_lv2: string;
  loai_co_phieu: string;
  tai_san_co_cam_ket_mua_lai: boolean;
  ngay_tao: string;
  ngay_cap_nhat: string;
  bi_xoa: boolean;
};

const itemKeys: (keyof TaiSanItem)[] = [
  "ma_tai_san",
  "ten_tai_san",
  "nhom_tai_san",
  "loai_tai_san_lv1",
  "loai_tai_san_lv2",
  "loai_co_phieu",
  "tai_san_co_cam_ket_mua_lai",
  "ngay_tao",
  "ngay_cap_nhat",
  "bi_xoa",
];

const itemKeysAdd: (keyof TaiSanItem)[] = [
  "ma_tai_san",
  "ten_tai_san",
  "nhom_tai_san",
  "loai_tai_san_lv1",
  "loai_tai_san_lv2",
  "loai_co_phieu",
  "tai_san_co_cam_ket_mua_lai",
];

const itemKeysUpdate: (keyof TaiSanItem)[] = [
  "ma_tai_san",
  "ten_tai_san",
  "nhom_tai_san",
  "loai_tai_san_lv1",
  "loai_tai_san_lv2",
  "loai_co_phieu",
  "tai_san_co_cam_ket_mua_lai",
];

export function TaiSanTable({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tableData, setTableData] = useState<TaiSanItem[]>(initData);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TaiSanItem | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (triggerRefetch) {
      fetchData();
    }
  }, [triggerRefetch]);

  useEffect(() => {
    return () => {
      setTriggerRefetch(true);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setTriggerRefetch(false);

    const query = `
        query {
          dm_tai_sans {
            items {
      ${itemKeys.join(" ")}
            }
          }
        }
      `;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log(query);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      setTableData(result?.data?.dm_tai_sans?.items || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const updateItem = async (updatedItem: TaiSanItem) => {
    const query = `
  # UPDATE
  
  mutation {
    executeupdatedm_tai_san(
  
    ${itemKeysUpdate.map((itemKey) => {
      if (itemKey === "tai_san_co_cam_ket_mua_lai") {
        return `${itemKey}: ${updatedItem[itemKey] ? true : false}`;
      }
      return `${itemKey}: "${(updatedItem as any)[itemKey]}"`;
    })}
    ) {
      result
    }
  }
  
  `;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log(query);
    setIsUpdating(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });
      const result = await response.json();

      setIsUpdating(false);
      if (result?.errors || response?.status !== 200) {
        alert(
          `Có lỗi xảy ra: ${(result?.errors || [])
            .map((error: any) => error?.message)
            .join(", ")}. ${response?.status !== 200 && `Status: ${response.status}`}`
        );
      } else {
        setTriggerRefetch(true);
        alert(`Cập nhật thành công`);
        setEditingItem(null);
      }
    } catch (error) {
      setIsUpdating(false);
      alert(`Có lỗi xảy ra: ${String(error)}`);
      console.error("Error :", error);
    }
  };

  const handleDeleteItem = async (maCty: string) => {
    setIsDeleting(true);
    const query = `
        # DELETE
        
        mutation{
          executedeletedm_tai_san(ma_tai_san: "${maCty}"
          )  {
           result   
          }
        }
        `;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log(query);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });

      setIsDeleting(false);

      const result = await response.json();
      if (result?.errors || response?.status !== 200) {
        alert(
          `Có lỗi xảy ra: ${(result?.errors || [])
            .map((error: any) => error?.message)
            .join(", ")}. ${response?.status !== 200 && `Status: ${response.status}`}`
        );
        setDeleteModalOpen(false);
      } else {
        setTriggerRefetch(true);
        alert("Xóa thành công");
        setDeleteModalOpen(false);
      }
    } catch (error) {
      setIsDeleting(false);
      alert(`Có lỗi xảy ra: ${String(error)}`);
      setDeleteModalOpen(false);
    }
  };

  const handleAddItem = async (item: TaiSanItem) => {
    const query = `
  # CREATE
  
  mutation {
    createdm_tai_san( item:{
      ${itemKeysAdd.map((itemKey) => {
        if (itemKey === "tai_san_co_cam_ket_mua_lai") {
          return `${itemKey}: ${item[itemKey] ? true : false}`;
        }
        return `${itemKey}: "${(item as any)[itemKey]}"`;
      })}
    }) {
      result
    }
  }
  `;

    console.log(item);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log(query);

    setIsAdding(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      setIsAdding(false);
      if (result?.errors || response?.status !== 200) {
        alert(
          `Có lỗi xảy ra: ${(result?.errors || [])
            .map((error: any) => error?.message)
            .join(", ")}. ${response?.status !== 200 && `Status: ${response.status}`}`
        );
      } else {
        setTriggerRefetch(true);
        alert(`Thêm mới thành công`);
        setAddModalOpen(false);
      }
    } catch (error) {
      setIsAdding(false);
      alert(`Có lỗi xảy ra: ${String(error)}`);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Tài Sản</h2>
        <Button onClick={() => setAddModalOpen(true)} disabled={isAdding}>
          <>
            <Plus /> Thêm mới
          </>
        </Button>
      </div>
      <div className='relative'>
        {!isLoading && (
          <div className='absolute top-0 right-0 mt-2 mr-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-gray-300 bg-gray-300 '>
              {[...itemKeys, "action"].map((col) => {
                return (
                  <TableHead key={col} className='font-semibold'>
                    {col === "action" ? "" : col}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    {[...itemKeys, "action"].map((col) => {
                      return (
                        <TableCell key={col}>
                          {col !== "action" ? (
                            <Skeleton className='h-6 w-full' />
                          ) : (
                            <div className='flex gap-1  w-full justify-end'>
                              <Skeleton className='h-6 w-6' />
                              <Skeleton className='h-6 w-6' />
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              : tableData.map((item, index) => (
                  <TableRow key={index}>
                    {itemKeys.map((itemKey) => {
                      return <TableCell key={itemKey}>{String(item[itemKey])}</TableCell>;
                    })}

                    <TableCell>
                      <div className='flex gap-2 w-full justify-end'>
                        <Button variant='outline' size='icon' onClick={() => setEditingItem(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                          <AlertDialogTrigger asChild>
                            <Button variant='outline' size='icon'>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            className={cn("bg-white", {
                              "pointer-events-none": isDeleting,
                            })}
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                              <Button
                                variant={"destructive"}
                                disabled={isDeleting}
                                onClick={() => handleDeleteItem(item.ma_tai_san)}
                              >
                                {isDeleting ? "Đang xóa..." : "Xóa"}
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateItem}
          isUpdating={isUpdating}
        />
      )}
      <AddModal
        isOpen={addModalOpen}
        onAdd={handleAddItem}
        onClose={() => setAddModalOpen(false)}
        isAdding={isAdding}
      />
    </div>
  );
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: TaiSanItem) => void;
  isAdding: boolean;
}

const init: TaiSanItem = {
  ma_tai_san: "",
  ten_tai_san: "",
  nhom_tai_san: "",
  loai_tai_san_lv1: "",
  loai_tai_san_lv2: "",
  loai_co_phieu: "",
  tai_san_co_cam_ket_mua_lai: false,
  ngay_tao: "",
  ngay_cap_nhat: "",
  bi_xoa: false,
};

export function AddModal({ isOpen, onClose, onAdd, isAdding }: AddModalProps) {
  const [state, setState] = useState<TaiSanItem>(init);

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
          {itemKeysAdd.map((itemKey) => {
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

          <Button disabled={isAdding} onClick={() => onAdd(state)}>
            {isAdding ? (
              <>
                {/* <Loader2 className='mr-2 h-4 w-4 animate-spin' /> */}
                Đang thêm...
              </>
            ) : (
              "Thêm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedData: TaiSanItem) => void;
  initialData: TaiSanItem;
  isUpdating: boolean;
}
export function EditModal({ isOpen, onClose, onSave, initialData, isUpdating }: EditModalProps) {
  const [state, setState] = useState<TaiSanItem>(initialData);

  const handleSave = () => {
    onSave(state);
  };

  useEffect(() => {
    setState(initialData);
  }, [open, initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white  w-[700px] max-w-none'>
        <DialogHeader>
          <DialogTitle className=''>Chỉnh sửa</DialogTitle>
        </DialogHeader>
        <div className='gap-4 py-4 grid  grid-cols-2 '>
          {itemKeysUpdate.map((itemKey) => {
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
                      setState((old: any) => ({
                        ...old,
                        [itemKey]: checked,
                      }))
                    }
                  />
                ) : (
                  <Input
                    id={itemKey}
                    value={(state as any)[itemKey]}
                    disabled={itemKey === "ma_tai_san"}
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
          <Button disabled={isUpdating} onClick={handleSave}>
            {isUpdating ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
