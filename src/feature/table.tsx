/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditModal } from "./edit-modal";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AddModal } from "./add-modal";

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
  // Add some sample data here
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
    setTriggerRefetch(false);
    const endpoint =
      "https://api.fabric.microsoft.com/v1/workspaces/836c7159-00d0-4a0c-af5e-c76cd38c1444/graphqlapis/7a4a7e49-7c6d-401e-9fd4-817a3b483efc/graphql";
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
    } catch (error) {
      console.error("Error fetching data:", error);
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
    return `${itemKey}: "${updatedItem[itemKey]}"`;
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
      return `${itemKey}: "${item[itemKey]}"`;
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
    <div className=' overflow-auto  flex flex-col gap-6'>
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
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {Object.keys(row).map((key: any) => {
                return (
                  <TableCell className='' key={key}>
                    {String(row[key as any])}
                  </TableCell>
                );
              })}

              <TableCell>
                <div className='flex gap-2'>
                  <Button variant='outline' size='icon' onClick={() => handleEdit(row)}>
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleDelete(row.key_tai_san)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
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
