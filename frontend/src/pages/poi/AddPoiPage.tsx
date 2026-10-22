import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { PoiMapPicker } from "./components/PoiMapPicker";
import { PoiFormDrawer } from "./components/PoiFormDrawer";
import { useCreatePoi, useUpdatePoi, usePoiDetail } from "@/queries/poi.queries";
import { PoiFormData } from "@/schemas/poi.schema";
import { showToast } from "@/lib/toast";

export const AddPoiPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const { data: existingPoi, isLoading: isLoadingDetail } = usePoiDetail(editId || "");
  const createMutation = useCreatePoi();
  const updateMutation = useUpdatePoi();

  const [latitude, setLatitude] = useState(28.1206);
  const [longitude, setLongitude] = useState(77.5382);
  const [addressSearch, setAddressSearch] = useState("Yamuna Expressway, Jewar Toll Plaza");

  useEffect(() => {
    if (existingPoi) {
      setLatitude(existingPoi.latitude);
      setLongitude(existingPoi.longitude);
      setAddressSearch(existingPoi.street);
    }
  }, [existingPoi]);

  const handleCoordinatesChange = (lat: number, lng: number, placeHint?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    if (placeHint && placeHint !== "Selected Map Point") {
      setAddressSearch(placeHint);
    }
  };

  const handleFormSubmit = async (formData: PoiFormData) => {
    try {
      const payload: PoiFormData = {
        ...formData,
        latitude,
        longitude
      };

      if (editId) {
        await updateMutation.mutateAsync({ id: editId, data: payload });
        showToast.success(`POI "${payload.name}" updated successfully!`);
      } else {
        await createMutation.mutateAsync(payload);
        showToast.success(`POI "${payload.name}" created successfully!`);
      }
      navigate("/poi/overview");
    } catch {
      showToast.error("Failed to save POI. Please check all required fields.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Context Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "POI Module", href: "/poi" },
          { label: editId ? "Edit POI" : "Add POI" }
        ]}
        title={editId ? "Edit Point of Interest" : "Add Point of Interest"}
        badge="MAP & FORM DUAL PANE"
        badgeVariant="cyan"
        description="Select exact geocoded coordinates on the interactive vector map and specify operational classification attributes."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/poi/overview")}
            leftIcon={<Compass className="h-4 w-4" />}
          >
            POI Overview
          </Button>
        }
      />

      {/* Main Dual-Pane Canvas (Figma #1097:18270) */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Left: Vector Map Canvas */}
        <div className="flex-1 min-w-0">
          <PoiMapPicker
            latitude={latitude}
            longitude={longitude}
            onCoordinatesChange={handleCoordinatesChange}
            addressSearch={addressSearch}
            onAddressSearchChange={setAddressSearch}
          />
        </div>

        {/* Right: Slide-out Configuration Drawer */}
        <PoiFormDrawer
          key={editId ? existingPoi?.id : "new"}
          initialValues={
            existingPoi
              ? {
                  name: existingPoi.name,
                  company: existingPoi.company,
                  branch: existingPoi.branch,
                  category: existingPoi.category,
                  street: existingPoi.street,
                  city: existingPoi.city,
                  state: existingPoi.state,
                  latitude: existingPoi.latitude,
                  longitude: existingPoi.longitude,
                  description: existingPoi.description,
                  isActive: existingPoi.isActive
                }
              : {
                  latitude,
                  longitude,
                  street: addressSearch
                }
          }
          onSubmit={handleFormSubmit}
          onCancel={() => navigate("/poi/overview")}
          isLoading={createMutation.isPending || updateMutation.isPending || isLoadingDetail}
        />
      </div>
    </div>
  );
};

export default AddPoiPage;
