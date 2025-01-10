/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddModal } from "./add-modal";
import { EditModal } from "./edit-modal";

const endpoint =
  "https://api.fabric.microsoft.com/v1/workspaces/836c7159-00d0-4a0c-af5e-c76cd38c1444/graphqlapis/7a4a7e49-7c6d-401e-9fd4-817a3b483efc/graphql";

export const ItemKeys = [
  "key_tai_san",
  "ten_tai_san",
  "nhom_tai_san",
  "loai_tai_san_lv1",
  "loai_tai_san_lv2",
  "tai_san_co_cam_ket_mua_lai",
  "loai_co_phieu",
];

const items: Item[] = [
  // Add some sample data
];

export interface Item {
  key_tai_san: string;
  ten_tai_san: string;
  nhom_tai_san: string;
  loai_tai_san_lv1: string;
  loai_tai_san_lv2: string;
  tai_san_co_cam_ket_mua_lai: boolean;
  loai_co_phieu: string;
}

type TProps = {
  token: string;
};
export default function TableManagement({ token }: TProps) {
  const [isLoadingTableData, setIsLoadingTableData] = useState(true);
  const [tableData, setTableData] = useState<Item[]>(items);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(true);

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const fetchData = async () => {
    setIsLoadingTableData(true);
    setTriggerRefetch(false);
    const query = `
      query {
        dm_tai_sans {
          items {
    ${ItemKeys.join(" ")}
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
      setTableData(result?.data?.dm_tai_sans?.items || []);
      setIsLoadingTableData(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoadingTableData(false);
    }
  };

  const updateData = async (updatedItem: Item) => {
    const endpoint =
      "https://api.fabric.microsoft.com/v1/workspaces/836c7159-00d0-4a0c-af5e-c76cd38c1444/graphqlapis/7a4a7e49-7c6d-401e-9fd4-817a3b483efc/graphql";
    const query = `
# UPDATE

mutation {
  executeupdatedm_tai_san(

  ${ItemKeys.map((itemKey) => {
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

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      alert(`Cập nhật thành công`);
      setEditingItem(null);
      setIsEditModalOpen(false);
      setTriggerRefetch(true);
    } catch (error) {
      alert(`Có lỗi xảy ra: ${String(error)}`);
      console.error("Error :", error);
    }
  };

  const handleDelete = async (keyTaiSan: string) => {
    const endpoint =
      "https://api.fabric.microsoft.com/v1/workspaces/836c7159-00d0-4a0c-af5e-c76cd38c1444/graphqlapis/7a4a7e49-7c6d-401e-9fd4-817a3b483efc/graphql";
    const query = `
      # DELETE
      
      mutation{
        executedeletedm_tai_san(key_tai_san: "${keyTaiSan}"
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
      alert(`Xóa thành công`);

      // setTriggerRefetch(true);
      setTableData((old) => old.filter((item) => item.key_tai_san !== keyTaiSan));
    } catch (error) {
      alert(`Có lỗi xảy ra: ${String(error)}`);
      console.error("Error :", error);
    }
  };

  const handleAddItem = async (item: Item) => {
    const endpoint =
      "https://api.fabric.microsoft.com/v1/workspaces/836c7159-00d0-4a0c-af5e-c76cd38c1444/graphqlapis/7a4a7e49-7c6d-401e-9fd4-817a3b483efc/graphql";
    const query = `
# CREATE

mutation {
  createdm_tai_san( item:{
    ${ItemKeys.map((itemKey) => {
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
      alert(`Thêm mới thành công`);
      setAddModalOpen(false);
      setTriggerRefetch(true);
    } catch (error) {
      alert(`Có lỗi xảy ra: ${String(error)}`);
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    // Mock token handling for development only.
    if (triggerRefetch) {
      fetchData();
    }
  }, [triggerRefetch]);

  return (
    <div className=' overflow-auto relative  flex flex-col gap-6'>
      <div className='flex justify-end'>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus /> Add new item
        </Button>
      </div>
      <Table className='border rounded '>
        <TableHeader>
          <TableRow className='bg-gray-200 rounded-t'>
            {ItemKeys.map((name) => {
              return (
                <TableHead className='font-semibold' key={name}>
                  {name}
                </TableHead>
              );
            })}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoadingTableData &&
            tableData.map((row, index) => (
              <TableRow key={index}>
                {Object.keys(row).map((key: any, _index) => {
                  return (
                    <TableCell className='' key={key + "" + _index}>
                      {String((row as any)[key])}
                    </TableCell>
                  );
                })}

                <TableCell>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='icon' onClick={() => handleEdit(row)}>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='outline' size='icon'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='bg-white'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              variant={"destructive"}
                              onClick={() => handleDelete(row.key_tai_san)}
                            >
                              Xóa
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {isLoadingTableData && (
            <tr>
              <td colSpan={ItemKeys.length + 1}>
                <div className=' flex items-center justify-center w-full h-56 bg-gray-50 '>
                  <div role='status'>
                    <svg
                      aria-hidden='true'
                      className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                      viewBox='0 0 100 101'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                        fill='currentColor'
                      />
                      <path
                        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                        fill='currentFill'
                      />
                    </svg>
                    <span className='sr-only'>Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </TableBody>
      </Table>

      {editingItem && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedData) => updateData(updatedData)}
          initialData={editingItem}
        />
      )}
      {addModalOpen && (
        <AddModal
          isOpen={addModalOpen}
          onAdd={handleAddItem}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  );
}
