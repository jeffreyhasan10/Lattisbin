import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface Column<T> {
  key: keyof T | "actions";
  header: string;
  sortable?: boolean;
  visibleOnMobile?: boolean;
  className?: string;
  tooltip?: string;
  render: (value: any, item: T) => JSX.Element;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
}

const DataTable = <T extends { id: number }>({
  columns,
  data,
  className = "",
  emptyMessage = "No data found.",
}: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    },
    [sortKey, sortDirection]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return [...data];

    return [...data].sort((a, b) => {
      const valueA = a[sortKey as keyof T];
      const valueB = b[sortKey as keyof T];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    });
  }, [data, sortKey, sortDirection]);

  const toggleRowExpansion = useCallback(
    (id: number) => {
      setExpandedRowId(expandedRowId === id ? null : id);
    },
    [expandedRowId]
  );

  const mobileColumns = useMemo(
    () => columns.filter((col) => col.visibleOnMobile !== false),
    [columns]
  );
  const hiddenColumns = useMemo(
    () => columns.filter((col) => col.visibleOnMobile === false),
    [columns]
  );

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const expandedRowVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className={`w-full space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border rounded-lg border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                {(isMobile ? mobileColumns : columns).map((column) => (
                  <TableHead
                    key={column.key}
                    className={`text-gray-700 dark:text-gray-200 font-medium px-4 py-3 ${column.className || ""}`}
                    style={{
                      minWidth: column.key === "name" ? "250px" : "150px",
                      ...(column.sortable ? { cursor: "pointer" } : {}),
                    }}
                    onClick={() => column.sortable && handleSort(column.key)}
                    role={column.sortable ? "button" : undefined}
                    aria-sort={
                      column.sortable && sortKey === column.key
                        ? sortDirection
                        : undefined
                    }
                  >
                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {column.header}
                      {column.sortable && sortKey === column.key && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      )}
                      {column.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div whileHover={{ scale: 1.2 }}>
                                <Info
                                  className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 cursor-help"
                                  aria-label={`Info about ${column.header}`}
                                />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200 p-2 rounded-lg">
                              <span>{column.tooltip}</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </motion.div>
                  </TableHead>
                ))}
                {isMobile && hiddenColumns.length > 0 && (
                  <TableHead className="w-12 px-2" aria-hidden="true"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <motion.tr
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TableCell
                    colSpan={
                      (isMobile ? mobileColumns : columns).length +
                      (isMobile && hiddenColumns.length > 0 ? 1 : 0)
                    }
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    {emptyMessage}
                  </TableCell>
                </motion.tr>
              ) : (
                <AnimatePresence>
                  {sortedData.map((row) => (
                    <>
                      <motion.tr
                        key={row.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150"
                      >
                        {(isMobile ? mobileColumns : columns).map((column) => (
                          <TableCell
                            key={`${row.id}-${column.key}`}
                            className={`px-4 py-3 align-middle ${column.className || ""}`}
                            style={{
                              maxWidth: column.key === "name" ? "250px" : "150px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {column.render(row[column.key], row)}
                          </TableCell>
                        ))}
                        {isMobile && hiddenColumns.length > 0 && (
                          <TableCell className="px-2 py-3 w-12">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleRowExpansion(row.id)}
                                aria-label={
                                  expandedRowId === row.id
                                    ? "Collapse row details"
                                    : "Expand row details"
                                }
                                className="p-1 h-7 w-7"
                              >
                                {expandedRowId === row.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </motion.div>
                          </TableCell>
                        )}
                      </motion.tr>

                      {isMobile && expandedRowId === row.id && (
                        <motion.tr
                          key={`expanded-${row.id}`}
                          variants={expandedRowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="bg-gray-50 dark:bg-gray-900/30"
                        >
                          <TableCell
                            colSpan={mobileColumns.length + 1}
                            className="px-4 py-4"
                          >
                            <div className="space-y-3 text-sm">
                              {hiddenColumns.map((column) => (
                                <div
                                  key={`expanded-${row.id}-${column.key}`}
                                  className="flex justify-between items-center"
                                >
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {column.header}:
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 max-w-xs break-words">
                                    {column.render(row[column.key], row)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </motion.tr>
                      )}
                    </>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
};

export default DataTable;