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
export const endpoint =
  "https://api.fabric.microsoft.com/v1/workspaces/836c7159-00d0-4a0c-af5e-c76cd38c1444/graphqlapis/7a4a7e49-7c6d-401e-9fd4-817a3b483efc/graphql";

const initData: CtyItem[] = [
  {
    id: "asdfasdf",
    ma_bravo: "asdfasdf",
    ma_cong_ty: "asdfasdf",
    ma_pias: "asdfasfd",
    ten_cong_ty: "asdfasdf",
    ten_cong_ty_ngan: "asdfasdf",
  },
  {
    id: "asdfasdf",
    ma_bravo: "asdfasdf",
    ma_cong_ty: "asdfasdf",
    ma_pias: "asdfasfd",
    ten_cong_ty: "asdfasdf",
    ten_cong_ty_ngan: "asdfasdf",
  },
  {
    id: "asdfasdf",
    ma_bravo: "asdfasdf",
    ma_cong_ty: "asdfasdf",
    ma_pias: "asdfasfd",
    ten_cong_ty: "asdfasdf",
    ten_cong_ty_ngan: "asdfasdf",
  },
  {
    id: "asdfasdf",
    ma_bravo: "asdfasdf",
    ma_cong_ty: "asdfasdf",
    ma_pias: "asdfasfd",
    ten_cong_ty: "asdfasdf",
    ten_cong_ty_ngan: "asdfasdf",
  },
];

type CtyItem = {
  id: string;
  ma_cong_ty: string;
  ma_bravo: string;
  ma_pias: string;
  ten_cong_ty: string;
  ten_cong_ty_ngan: string;
};

const itemKeys: (keyof CtyItem)[] = [
  "id",
  "ma_bravo",
  "ma_cong_ty",
  "ma_pias",
  "ten_cong_ty",
  "ten_cong_ty_ngan",
];

export function CtyTable({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tableData, setTableData] = useState<CtyItem[]>(initData);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CtyItem | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // useEffect(() => {
  //   if (triggerRefetch) {
  //     fetchData();
  //   }
  // }, [triggerRefetch]);

  useEffect(() => {
    return () => {
      setTriggerRefetch(true);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    const query = `
        query {
          dm_cong_ties {
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

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      setTableData(result?.data?.dm_cong_ties?.items || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const updateItem = async (updatedItem: CtyItem) => {
    const query = `
  # UPDATE
  
  mutation {
    executeupdatedm_cong_ty(
  
    ${itemKeys.map((itemKey) => {
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
            .join(", ")}. Status=${response?.status}`
        );
      } else {
        alert(`Cập nhật thành công`);
        setEditingItem(null);
        setTriggerRefetch(true);
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
          executedeletedm_cong_ty(ma_cong_ty: "${maCty}"
          )  {
           result   
          }
        }
        `;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

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
            .join(", ")}. Status=${response?.status}`
        );
        setDeleteModalOpen(false);
      } else {
        alert("Xóa thành công");
        setDeleteModalOpen(false);
        setTableData((old) => old.filter((item) => item.ma_cong_ty !== maCty));
      }
    } catch (error) {
      setIsDeleting(false);
      alert(`Có lỗi xảy ra: ${String(error)}`);
      setDeleteModalOpen(false);
    }
  };

  const handleAddItem = async (item: CtyItem) => {
    const query = `
  # CREATE
  
  mutation {
    createdm_cong_ty( item:{
      ${itemKeys
        .filter((_) => _ !== "id")
        .map((itemKey) => {
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
            .join(", ")}. Status=${response?.status}`
        );
      } else {
        alert(`Thêm mới thành công`);
        setAddModalOpen(false);
        setTriggerRefetch(true);
      }
    } catch (error) {
      setIsAdding(false);
      alert(`Có lỗi xảy ra: ${String(error)}`);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Công ty</h2>
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
                                onClick={() => handleDeleteItem(item.ma_cong_ty)}
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
  onAdd: (student: CtyItem) => void;
  isAdding: boolean;
}

const init: CtyItem = {
  id: "",
  ma_bravo: "",
  ma_cong_ty: "",
  ten_cong_ty: "",
  ten_cong_ty_ngan: "",
  ma_pias: "",
};

export function AddModal({ isOpen, onClose, onAdd, isAdding }: AddModalProps) {
  const [state, setState] = useState<CtyItem>(init);

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
          {itemKeys
            .filter((_) => _ !== "id")
            .map((itemKey) => {
              return (
                <div key={itemKey} className='grid   items-center gap-2'>
                  <Label className='text-gray-700' htmlFor={itemKey}>
                    {itemKey}
                  </Label>

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
  onSave: (editedData: CtyItem) => void;
  initialData: CtyItem;
  isUpdating: boolean;
}
export function EditModal({ isOpen, onClose, onSave, initialData, isUpdating }: EditModalProps) {
  const [state, setState] = useState<CtyItem>(initialData);

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
          {itemKeys.map((itemKey) => {
            return (
              <div key={itemKey} className='grid   items-center gap-2'>
                <Label className='text-gray-700' htmlFor={itemKey}>
                  {itemKey}
                </Label>

                <Input
                  id={itemKey}
                  value={(state as any)[itemKey]}
                  disabled={itemKey === "id"}
                  onChange={(e) =>
                    setState((old) => ({
                      ...old,
                      [itemKey]: e.target.value,
                    }))
                  }
                  // placeholder={itemKey}
                />
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
