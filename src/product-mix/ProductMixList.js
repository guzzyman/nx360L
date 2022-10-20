
import { useMemo } from "react";


import { Button, ButtonBase, Icon, Paper } from "@mui/material";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";


import PageHeader from "common/PageHeader";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";


import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";


import { urlSearchParamsExtractor } from "common/Utils";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import nimbleX360AdminProductMixApi from "./ProductMixStoreQuerySlice";

function ProductMixList(props) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { data, isLoading, isError, refetch } =
    nimbleX360AdminProductMixApi?.useGetAllProductMixQuery();

  const { q } = extractedSearchParams;


  const tableInstance = usePaginationSearchParamsTable({ columns, data });

  return (
    <>
      <PageHeader
        title="Product Mix"
        breadcrumbs={[
          {
            name: "Home",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_LOANS,
          },
          { name: "Product Mix" },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() =>
            navigate(RouteEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX_ADD)
          }
        >
          Create Product Mix
        </Button>
      </PageHeader>
      <Paper className="p-4">
        <div className="flex items-center flex-wrap mb-4">
          <SearchTextField
            placeholder="Search item list"
            size="small"
            value={q}
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, q: e.target.value },
                { replace: true }
              )
            }
          />
          <div className="flex-1" />
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(
                  RouteEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX_EDIT,
                  {
                    productId: row.original.productId,
                  }
                )
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default ProductMixList;

const columns = [{ Header: "Name", accessor: "productName" }];
