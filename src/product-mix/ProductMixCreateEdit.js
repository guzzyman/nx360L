import React, { useEffect, useState } from "react";

import {
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  Button,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "common/BackButton";
import LoadingContent from "common/LoadingContent";
import SearchTextField from "common/SearchTextField";
import nimbleX360AdminProductMixApi from "./ProductMixStoreQuerySlice";

import { RouteEnum } from "common/Constants";

import useToggle from "hooks/useToggle";
import PageHeader from "common/PageHeader";

function ProductMixCreateEdit(props) {
  const [checked, setChecked] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(0);
  const [allowedProducts, setAllowedProducts] = useState([]);
  const [restrictedProducts, setRestrictedProducts] = useState([]);
  const [searchedAllowedProducts, setSearchedAllowProducts] = useState([]);
  const [searchedRestrictedProducts, setSearchedRestrictedroducts] = useState(
    []
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let { productId } = useParams();

  const {
    data: listOfProducts,
    isLoading,
    isError,
    refetch,
  } = nimbleX360AdminProductMixApi?.useGetProductsQuery();

  const [getProductDetails, { data: productDetailsData }] =
    nimbleX360AdminProductMixApi?.useLazyGetProductDetailsByIdQuery();

  const [createProductMix, { isLoading: isCreatingProductMix }] =
    nimbleX360AdminProductMixApi.useCreateProductMixMutation();

  const [editProductMix, { isLoading: isEditingProductMix }] =
    nimbleX360AdminProductMixApi.useEditProductMixMutation();
  // eslint-disable-next-line
  const [showProductDetails, __, setShowProductDetails] = useToggle(false);

  useEffect(() => {
    if (productDetailsData?.allowedProducts) {
      setAllowedProducts(productDetailsData?.allowedProducts);
    }

    if (productDetailsData?.restrictedProducts) {
      setRestrictedProducts(productDetailsData?.restrictedProducts);
    }
  }, [productDetailsData]);

  useEffect(() => {
    if (listOfProducts?.productOptions?.length) {
      setCurrentProductId(+productId);
      getProductDetails(+productId);
    }
    // eslint-disable-next-line
  }, [listOfProducts]);

  useEffect(() => {
    currentProductId && setShowProductDetails(true);
    // eslint-disable-next-line
  }, [currentProductId]);

  const not = (a, b) => {
    return a.filter((value) => b.indexOf(value.id) === -1);
  };

  const intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value.id) !== -1);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleMoveAllAllowedProductsToRestrictedProducts = () => {
    setRestrictedProducts((prvState) => [...prvState, ...allowedProducts]);
    setAllowedProducts([]);
  };

  const handleMoveCheckedAllowedProducts = () => {
    setRestrictedProducts((prvState) => [
      ...prvState,
      ...intersection(allowedProducts, checked),
    ]);
    setAllowedProducts(not(allowedProducts, checked));
    setChecked([]);
  };

  const handleMoveCheckedRestrictedProducts = () => {
    setAllowedProducts((prvState) => [
      ...prvState,
      ...intersection(restrictedProducts, checked),
    ]);
    setRestrictedProducts(not(restrictedProducts, checked));
    setChecked([]);
  };

  const handleMovellAllRestrictedProductsToAllowedProducts = () => {
    setAllowedProducts((prvState) => [...prvState, ...restrictedProducts]);
    setRestrictedProducts([]);
  };

  const customList = (items) => (
    <Paper elevation={0} sx={{ width: "100%", height: 230, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items?.map((value) => {
          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": value.id,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={value.id} primary={value.name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  const handleFetchProductDetails = async (e) => {
    setCurrentProductId(+e?.target?.value);
    await getProductDetails(e?.target?.value);

    setShowProductDetails(true);
  };

  const handleCreateProductMix = async () => {
    const payload = {
      productId: currentProductId,
      restrictedProducts: restrictedProducts.map((prd) => prd.id),
    };

    try {
      (await productId)
        ? editProductMix(payload).unwrap()
        : createProductMix(payload).unwrap();

      enqueueSnackbar(
        !productId
          ? "Product Mix  Successful Created"
          : "Product Mix  Successful Edited",
        {
          variant: "success",
        }
      );
      navigate(RouteEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX);
    } catch (error) {
      enqueueSnackbar(
        !productId
          ? "Error: Product Mix was not created, try again"
          : "Error: Product Mix was not edited, try again",
        {
          variant: "error",
        }
      );
    }
  };

  const handleAllowedProductsSearch = (e) => {
    const allowedProductMix = allowedProducts?.filter(
      (prd) =>
        e?.target?.value &&
        prd?.name?.toLowerCase()?.includes(e?.target?.value.toLowerCase())
    );

    setSearchedAllowProducts(() => (e?.target?.value ? allowedProductMix : []));
  };

  const handleRestrictedProductsSearch = (e) => {
    const restrictedProductMix = restrictedProducts?.filter(
      (prd) =>
        e?.target?.value &&
        prd?.name?.toLowerCase()?.includes(e?.target?.value.toLowerCase())
    );

    setSearchedRestrictedroducts(() =>
      e?.target?.value ? restrictedProductMix : []
    );
  };

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton variant="text" />}
        // title={
        //   <b>
        //     {productId && "Edit"} Product Mix
        //     {productId && `(${productDetailsData?.productName || ""})`}
        //   </b>
        // }
        breadcrumbs={[
          { name: "Administration", to: RouteEnum.ADMINISTRATION },
          { name: `${productId ? "Edit" : "Create"} Product Mix` },
        ]}
      />

      <Paper className=" p-4 md:p-8 rounded-md">
        <div className="max-w-2xl ">
          <Typography variant="h6" className="font-bold">
            {productId && "Edit"} Product Mix
            {productId && `(${productDetailsData?.productName || ""})`}
          </Typography>
          <Typography variant="body2" className="mb-4" color="textSecondary">
            Kindly select Allowed and Restricted products for your mixins.
          </Typography>

          <div className="my-8 ">
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={12} md={12}>
                <Box flex justifyContent="center">
                  {!productId && (
                    <TextField
                      label="Select Product"
                      fullWidth
                      select
                      displayEmpty
                      onChange={handleFetchProductDetails}
                      value={currentProductId}
                      defaultValue={currentProductId}
                    >
                      {listOfProducts?.productOptions?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Box>
              </Grid>
            </Grid>

            <LoadingContent
              loading={isLoading}
              error={isError}
              onReload={refetch}
            >
              {() => {
                return (
                  <>
                    {showProductDetails && (
                      <Grid container spacing={2} mt={1} alignItems="center">
                        <Grid item xs={12} md={5}>
                          <Typography
                            variant="subtitle1"
                            className="text-gray-500 text-center font-semibold"
                            component="div"
                          >
                            Allowed Products
                          </Typography>
                          <div className="shadow-md mt-1 py-3 px-2 rounded-lg">
                            <div className="flex items-center flex-wrap mb-4">
                              <SearchTextField
                                placeholder="Search item list"
                                size="small"
                                // value={q}
                                fullWidth
                                onChange={handleAllowedProductsSearch}
                              />
                              <div className="flex-1" />
                            </div>
                            {customList(
                              searchedAllowedProducts.length
                                ? searchedAllowedProducts
                                : allowedProducts
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                          >
                            <Button
                              sx={{ my: 0.5 }}
                              variant="outlined"
                              size="small"
                              onClick={
                                handleMoveAllAllowedProductsToRestrictedProducts
                              }
                              disabled={allowedProducts.length === 0}
                              aria-label="move all right"
                            >
                              ≫
                            </Button>
                            <Button
                              sx={{ my: 0.5 }}
                              variant="outlined"
                              size="small"
                              onClick={handleMoveCheckedAllowedProducts}
                              disabled={allowedProducts.length === 0}
                              aria-label="move selected right"
                            >
                              &gt;
                            </Button>
                            <Button
                              sx={{ my: 0.5 }}
                              variant="outlined"
                              size="small"
                              onClick={handleMoveCheckedRestrictedProducts}
                              disabled={restrictedProducts.length === 0}
                              aria-label="move selected left"
                            >
                              &lt;
                            </Button>
                            <Button
                              sx={{ my: 0.5 }}
                              variant="outlined"
                              size="small"
                              onClick={
                                handleMovellAllRestrictedProductsToAllowedProducts
                              }
                              disabled={restrictedProducts.length === 0}
                              aria-label="move all left"
                            >
                              ≪
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Typography
                            variant="subtitle1"
                            className="text-gray-500 text-center font-semibold"
                            component="div"
                          >
                            Restricted Products
                          </Typography>
                          <div className="shadow-md py-3 mt-1 px-2 rounded-lg">
                            <div className="flex items-center flex-wrap mb-4">
                              <SearchTextField
                                placeholder="Search item list"
                                size="small"
                                fullWidth
                                onChange={handleRestrictedProductsSearch}
                              />
                            </div>
                            {customList(
                              searchedRestrictedProducts.length
                                ? searchedRestrictedProducts
                                : restrictedProducts
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    )}
                  </>
                );
              }}
            </LoadingContent>
          </div>
        </div>
      </Paper>

      {showProductDetails && (
        <div className="flex mt-10 w-full justify-end">
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="large"
              className="mr-3"
              onClick={(_) => navigate(-1)}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              size="large"
              onClick={handleCreateProductMix}
              disabled={
                isCreatingProductMix ||
                !restrictedProducts.length ||
                isEditingProductMix
              }
              loading={isCreatingProductMix || isEditingProductMix}
            >
              {!productId ? "Create" : "Save Changes"}
            </LoadingButton>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductMixCreateEdit;
