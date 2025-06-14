import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Truck, Car, Key, Calendar, CheckCircle, AlertTriangle, MoreHorizontal, Eye, Pencil, Trash2, Download, RotateCcw, Filter, AlertTriangle as AlertTriangleIcon, ChevronUp, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RentableLorry {
  id: number;
  registrationNumber: string;
  type: string;
  model: string;
  capacity: string;
  location: string;
  status: string;
  lastService: Date | null;
  nextService: Date | null;
  rentalCost: number;
  notes: string;
}

const DUMMY_LORRIES: RentableLorry[] = [
  {
    id: 1,
    registrationNumber: "ABC 123",
    type: "Rental",
    model: "Toyota Hilux",
    capacity: "2 Ton",
    location: "Kuala Lumpur",
    status: "Available",
    lastService: new Date("2023-12-01"),
    nextService: new Date("2024-06-01"),
    rentalCost: 250,
    notes: "Good condition",
  },
  {
    id: 2,
    registrationNumber: "DEF 456",
    type: "Owned",
    model: "Isuzu NPR",
    capacity: "3 Ton",
    location: "Petaling Jaya",
    status: "In Use",
    lastService: new Date("2024-01-15"),
    nextService: new Date("2024-07-15"),
    rentalCost: 0,
    notes: "Needs new tires",
  },
  {
    id: 3,
    registrationNumber: "GHI 789",
    type: "Rental",
    model: "Mitsubishi Fuso",
    capacity: "5 Ton",
    location: "Shah Alam",
    status: "Maintenance",
    lastService: new Date("2024-02-01"),
    nextService: new Date("2024-03-01"),
    rentalCost: 400,
    notes: "Engine overhaul",
  },
  {
    id: 4,
    registrationNumber: "JKL 012",
    type: "Owned",
    model: "Hino 500",
    capacity: "8 Ton",
    location: "Johor Bahru",
    status: "Available",
    lastService: new Date("2023-11-10"),
    nextService: new Date("2024-05-10"),
    rentalCost: 0,
    notes: "Ready for long haul",
  },
  {
    id: 5,
    registrationNumber: "MNO 345",
    type: "Rental",
    model: "Nissan UD",
    capacity: "10 Ton",
    location: "Penang",
    status: "In Use",
    lastService: new Date("2024-01-20"),
    nextService: new Date("2024-07-20"),
    rentalCost: 550,
    notes: "Requires AdBlue",
  },
];

const filterSchema = z.object({
  type: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
});

const RentableLorries = () => {
  const [lorries, setLorries] = useState<RentableLorry[]>(DUMMY_LORRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof RentableLorry | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedLorry, setSelectedLorry] = useState<RentableLorry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    location: "",
  });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      type: "",
      status: "",
      location: "",
    },
  });

  const handleOpenModal = (lorry?: RentableLorry) => {
    setSelectedLorry(lorry || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLorry(null);
  };

  const handleSaveLorry = (lorryData: RentableLorry) => {
    if (selectedLorry) {
      setLorries((prev) =>
        prev.map((lorry) => (lorry.id === selectedLorry.id ? lorryData : lorry))
      );
      toast({
        title: "Lorry updated.",
        description: "The lorry details have been updated successfully.",
      });
    } else {
      const newId =
        lorries.length > 0 ? Math.max(...lorries.map((lorry) => lorry.id)) + 1 : 1;
      const newLorry = { ...lorryData, id: newId };
      setLorries((prev) => [...prev, newLorry]);
      toast({
        title: "New lorry added.",
        description: "A new lorry has been added to the inventory.",
      });
    }
    handleCloseModal();
  };

  const handleDeleteLorry = (id: number) => {
    setLorries((prev) => prev.filter((lorry) => lorry.id !== id));
    toast({
      title: "Lorry deleted.",
      description: "The lorry has been removed from the inventory.",
    });
  };

  const handleSort = (key: keyof RentableLorry) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredLorries = useMemo(() => {
    let filtered = [...lorries];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((lorry) => {
        return (
          lorry.registrationNumber.toLowerCase().includes(lowerCaseQuery) ||
          lorry.model.toLowerCase().includes(lowerCaseQuery) ||
          lorry.location.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    if (filters.type) {
      filtered = filtered.filter((lorry) => lorry.type === filters.type);
    }
    if (filters.status) {
      filtered = filtered.filter((lorry) => lorry.status === filters.status);
    }
    if (filters.location) {
      filtered = filtered.filter((lorry) => lorry.location === filters.location);
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        if (valueA == null || valueB == null) {
          return 0;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        if (valueA instanceof Date && valueB instanceof Date) {
          return sortDirection === "asc"
            ? valueA.getTime() - valueB.getTime()
            : valueB.getTime() - valueA.getTime();
        }

        if (typeof valueA === "number" && typeof valueB === "number") {
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }

        return 0;
      });
    }

    return filtered;
  }, [lorries, searchQuery, sortKey, sortDirection, filters]);

  const formatDate = (dateValue: any) => {
    if (!dateValue || typeof dateValue === 'boolean') {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const columns = [
    {
      key: "registrationNumber" as keyof RentableLorry,
      header: "Registration",
      sortable: true,
      render: (value: any) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
      ),
    },
    {
      key: "type" as keyof RentableLorry,
      header: "Type",
      sortable: true,
      render: (value: any) => (
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5 rounded-full font-medium"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "model" as keyof RentableLorry,
      header: "Model",
      sortable: true,
      render: (value: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      ),
    },
    {
      key: "capacity" as keyof RentableLorry,
      header: "Capacity",
      sortable: true,
      render: (value: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      ),
    },
    {
      key: "location" as keyof RentableLorry,
      header: "Location",
      sortable: true,
      render: (value: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      ),
    },
    {
      key: "status" as keyof RentableLorry,
      header: "Status",
      sortable: true,
      render: (value: any) => (
        <Badge
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            value === "Available"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : value === "In Use"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
          }`}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "lastService" as keyof RentableLorry,
      header: "Last Service",
      sortable: true,
      render: (value: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "nextService" as keyof RentableLorry,
      header: "Next Service",
      sortable: true,
      render: (value: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "rentalCost" as keyof RentableLorry,
      header: "Rental Cost",
      sortable: true,
      render: (value: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">RM {value}</span>
      ),
    },
    {
      key: "notes" as keyof RentableLorry,
      header: "Notes",
      render: (value: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, lorry: RentableLorry) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenModal(lorry)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenModal(lorry)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDeleteLorry(lorry.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search lorries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Filter
              </TooltipContent>
            </TooltipProvider>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lorry
        </Button>
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={isFilterOpen} className="justify-between">
            Filters
            <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => setFilters(values))} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Status" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Apply Filters</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm"
                  style={{
                    minWidth: "150px",
                    ...(column.sortable ? { cursor: "pointer" } : {}),
                  }}
                  onClick={() => column.sortable && handleSort(column.key as keyof RentableLorry)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === "asc" ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLorries.map((lorry) => (
              <tr
                key={lorry.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td key={`${lorry.id}-${column.key}`} className="px-4 py-3 align-middle">
                    {column.render ? column.render(lorry[column.key as keyof RentableLorry], lorry) : lorry[column.key as keyof RentableLorry]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedLorry ? "Edit Lorry" : "Add Lorry"}</DialogTitle>
            <DialogDescription>
              {selectedLorry
                ? "Update the lorry details here. Click save when you're done."
                : "Enter the lorry details here. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <LorryForm
            lorry={selectedLorry}
            onSave={handleSaveLorry}
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface LorryFormProps {
  lorry?: RentableLorry | null;
  onSave: (lorryData: RentableLorry) => void;
  onCancel: () => void;
}

const lorrySchema = z.object({
  registrationNumber: z.string().min(3, {
    message: "Registration number must be at least 3 characters.",
  }),
  type: z.string().min(3, {
    message: "Type must be at least 3 characters.",
  }),
  model: z.string().min(3, {
    message: "Model must be at least 3 characters.",
  }),
  capacity: z.string().min(3, {
    message: "Capacity must be at least 3 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  status: z.string().min(3, {
    message: "Status must be at least 3 characters.",
  }),
  lastService: z.date(),
  nextService: z.date(),
  rentalCost: z.number(),
  notes: z.string().optional(),
});

const LorryForm: React.FC<LorryFormProps> = ({ lorry, onSave, onCancel }) => {
  const form = useForm<z.infer<typeof lorrySchema>>({
    resolver: zodResolver(lorrySchema),
    defaultValues: {
      registrationNumber: lorry?.registrationNumber || "",
      type: lorry?.type || "",
      model: lorry?.model || "",
      capacity: lorry?.capacity || "",
      location: lorry?.location || "",
      status: lorry?.status || "",
      lastService: lorry?.lastService || new Date(),
      nextService: lorry?.nextService || new Date(),
      rentalCost: lorry?.rentalCost || 0,
      notes: lorry?.notes || "",
    },
  });

  const onSubmit = (values: z.infer<typeof lorrySchema>) => {
    onSave({ ...values, id: lorry?.id || 0 });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="Registration Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input placeholder="Capacity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input placeholder="Status" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastService"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Service Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nextService"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Service Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rentalCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rental Cost</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Rental Cost"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default RentableLorries;
