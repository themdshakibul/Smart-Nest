"use client";

import { deleteFavorite } from "@/lib/actions/AddToFavorite";
import { TrashBin } from "@gravity-ui/icons";
import { Pagination, Table } from "@heroui/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FavoritePropertiesTableClient({
  favoritePropertiesData,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFavorites = favoritePropertiesData?.data;
  const currentPage = favoritePropertiesData?.page || 1;
  const totalPages = favoritePropertiesData?.totalPage || 1;
  const totalCount = favoritePropertiesData?.totalData || 0;

  const [favorites, setFavorites] = useState(initialFavorites);

  useEffect(() => {
    setFavorites(initialFavorites);
  }, [initialFavorites]);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const updateSearchParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleDeleteConfirmation = (favoriteId, propertyTitle) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm sm:max-w-md w-full bg-surface shadow-lg rounded-xl pointer-events-auto flex flex-col p-4 border border-border/60 mx-4 sm:mx-0`}
        >
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-primary">
              Remove from Favorites?
            </p>
            <p className="font-body text-xs text-muted mt-1">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                "{propertyTitle}"
              </span>{" "}
              from your favorite properties?
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 font-body text-xs font-medium text-muted hover:bg-surface-container-high rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await executeRemove(favoriteId, propertyTitle);
              }}
              className="px-3 py-1.5 font-body text-xs font-medium bg-danger text-white rounded-md hover:bg-danger/90 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };

  const executeRemove = async (favoriteId, propertyTitle) => {
    const toastId = toast.loading("Removing listing from saved items...");
    try {
      const response = await deleteFavorite(favoriteId);

      if (!response || response.success === false) {
        throw new Error("Failed to remove item record.");
      }

      setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
      toast.success(`${propertyTitle} removed successfully!`, { id: toastId });
      router.refresh();
    } catch (error) {
      console.error("Remove Favorite Error:", error);
      toast.error(`Could not remove ${propertyTitle}. Please try again.`, {
        id: toastId,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-8 px-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary">
          My Favorites
        </h1>
        <p className="font-body text-sm text-muted mt-1">
          Manage your property reservations, tracking details and payment
          states.
        </p>
      </div>
      <div className="w-full bg-surface rounded-2xl sm:rounded-3xl shadow-sm border border-border/40 overflow-hidden">
        <Table.ScrollContainer className="w-full overflow-x-auto object-contain last:border-0">
          <Table className="w-full min-w-[600px] text-left border-collapse table-auto">
            <Table.Content aria-label="User responsive favorite properties table">
              <Table.Header className="bg-surface-container-low border-b border-border/60">
                <Table.Column
                  isRowHeader
                  className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4"
                >
                  Property
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Location
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Rent Price
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Rent Type
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
                  Actions
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {favorites?.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={5}
                      className="text-center font-body text-muted py-12"
                    >
                      You have no saved properties yet.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  favorites?.map((item) => (
                    <Table.Row
                      key={item._id}
                      className="border-b border-border/30 hover:bg-surface-container-lowest transition-colors duration-150"
                    >
                      <Table.Cell className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-14 rounded-md overflow-hidden bg-card flex-shrink-0 border border-border/40 relative">
                            <Image
                              src={
                                item.propertyImage?.[0] ||
                                "https://placehold.co/600x400?text=Property"
                              }
                              alt={item.propertyTitle || "Property"}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="max-w-[220px] sm:max-w-xs overflow-hidden">
                            <div className="font-body text-sm font-semibold text-primary truncate">
                              {item.propertyTitle || "Untitled Property"}
                            </div>
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell className="p-4 font-body text-sm text-muted whitespace-nowrap">
                        {item.propertyLocation || "N/A"}
                      </Table.Cell>

                      <Table.Cell className="p-4 whitespace-nowrap">
                        <div className="font-body text-sm font-semibold text-primary">
                          $
                          {Number(item.propertyRentPrice || 0).toLocaleString()}
                        </div>
                      </Table.Cell>

                      <Table.Cell className="p-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide uppercase bg-surface-container border border-border/40 text-foreground">
                          {item.propertyRentType || "Monthly"}
                        </span>
                      </Table.Cell>

                      <Table.Cell className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() =>
                              handleDeleteConfirmation(
                                item._id,
                                item.propertyTitle,
                              )
                            }
                            title="Remove from Favorites"
                            className="p-1.5 text-muted hover:text-danger rounded-md hover:bg-danger/10 transition-colors cursor-pointer inline-flex items-center justify-center"
                          >
                            <TrashBin
                              width={18}
                              height={18}
                              className="text-secondary"
                            />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Content>
          </Table>
        </Table.ScrollContainer>

        <Table.Footer className="p-4 bg-surface-container-lowest border-t border-border/40 text-xs font-body text-muted flex items-center justify-between">
          <span>
            Showing {favorites?.length || 0} of {totalCount} saved properties
          </span>
        </Table.Footer>
      </div>

      {/* ✅ Pagination — same pattern as AllPropertiesTableClient */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination className="flex flex-col sm:flex-row items-center gap-4 bg-card/20 p-4 rounded-xl border border-border/40">
            <Pagination.Summary className="text-xs text-muted font-body">
              Page {currentPage} of {totalPages}
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  disabled={currentPage === 1}
                  onClick={() =>
                    currentPage > 1 &&
                    updateSearchParam("page", currentPage - 1)
                  }
                  className={`flex items-center gap-1 text-sm font-body ${
                    currentPage === 1
                      ? "opacity-50 pointer-events-none"
                      : "cursor-pointer"
                  }`}
                >
                  <Pagination.PreviousIcon />
                  <span>Previous</span>
                </Pagination.Previous>
              </Pagination.Item>

              {pages.map((pageNum) => (
                <Pagination.Item key={pageNum}>
                  <Pagination.Link
                    isActive={currentPage === pageNum}
                    onClick={() => updateSearchParam("page", pageNum)}
                    className={`cursor-pointer font-body text-sm relative transition-colors ${
                      currentPage === pageNum
                        ? "bg-secondary backdrop-blur-sm text-white"
                        : ""
                    }`}
                  >
                    {pageNum}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              <Pagination.Item>
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    currentPage < totalPages &&
                    updateSearchParam("page", currentPage + 1)
                  }
                  className={`flex items-center gap-1 text-sm font-body ${
                    currentPage === totalPages
                      ? "opacity-50 pointer-events-none"
                      : "cursor-pointer"
                  }`}
                >
                  <span>Next</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}
