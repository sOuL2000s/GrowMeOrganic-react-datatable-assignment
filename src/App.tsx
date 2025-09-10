import { useState, useEffect, useCallback, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { ScrollPanel } from 'primereact/scrollpanel';
import type { DataTableStateEvent } from 'primereact/datatable';
import type { Artwork, ApiResponse, SelectedArtworkMinimal } from './types';
import './App.css'; // For basic app-wide styling

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(12); // Default API limit
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Row selection states
  const [selectedArtworksMap, setSelectedArtworksMap] = useState<Map<number, SelectedArtworkMinimal>>(new Map());
  const [selectedRowsOnCurrentPage, setSelectedRowsOnCurrentPage] = useState<Artwork[]>([]);

  // Function to fetch artworks for a given page
  const fetchArtworks = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
      setRowsPerPage(data.pagination.limit);
    } catch (e: unknown) {
      console.error("Failed to fetch artworks:", e);
      if (e instanceof Error) {
        setError("Failed to load artworks: " + e.message);
      } else {
        setError("An unknown error occurred while loading artworks.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch data when the current page changes
  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage, fetchArtworks]);

  // Effect to synchronize selectedRowsOnCurrentPage with the global selectedArtworksMap
  useEffect(() => {
    const newSelectedRowsOnCurrentPage: Artwork[] = artworks.filter(artwork =>
      selectedArtworksMap.has(artwork.id)
    );
    setSelectedRowsOnCurrentPage(newSelectedRowsOnCurrentPage);
  }, [artworks, selectedArtworksMap]);

  // Handler for DataTable's onSelectionChange event
  const handleSelectionChange = (e: Artwork[]) => {
    const newSelectedArtworksMap = new Map(selectedArtworksMap);

    const currentSelectedPageIds = new Set(e.map(artwork => artwork.id));

    artworks.forEach(artwork => {
      if (currentSelectedPageIds.has(artwork.id)) {
        newSelectedArtworksMap.set(artwork.id, {
          id: artwork.id,
          title: artwork.title,
          artist_display: artwork.artist_display,
        });
      } else {
        newSelectedArtworksMap.delete(artwork.id);
      }
    });

    setSelectedArtworksMap(newSelectedArtworksMap);
    setSelectedRowsOnCurrentPage(e);
  };

  // Handler for PrimeReact's DataTable paginator
  const onPageChange = (event: DataTableStateEvent) => {
    if (event.page !== undefined) {
      setCurrentPage(event.page + 1);
    }
  };

  // Function to remove a single artwork from the selection panel
  const removeSelectedArtwork = useCallback((idToRemove: number) => {
    setSelectedArtworksMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.delete(idToRemove);
      return newMap;
    });
  }, []);

  // Use useMemo for selected art list in the panel
  const selectedArtworksList = useMemo(() => {
    return Array.from(selectedArtworksMap.values());
  }, [selectedArtworksMap]);


  return (
    <div className="p-d-flex p-flex-column p-ai-center app-container">
      <h1 className="p-mb-4">Art Institute of Chicago Artworks</h1>

      {/* Custom Row Selection Panel - IMPROVED UI */}
      <div className="card p-4 p-mb-4 p-fluid w-full max-w-screen-lg surface-card shadow-2 border-round">
        <h3 className="p-mb-3">Selected Artworks ({selectedArtworksMap.size})</h3>
        {selectedArtworksMap.size === 0 ? (
          <p className="p-text-secondary">No artworks selected yet.</p>
        ) : (
          <ScrollPanel style={{ width: '100%', height: '200px' }} className="custom-scrollpanel p-mb-3">
            <div className="p-d-flex p-flex-wrap p-gap-2">
              {selectedArtworksList.map(item => (
                <Chip
                  key={item.id}
                  label={`${item.title} by ${item.artist_display || 'Unknown Artist'}`}
                  removable
                  // Fix: Ensure onRemove returns boolean to satisfy TypeScript type definition
                  onRemove={() => {
                    removeSelectedArtwork(item.id);
                    return true; // Explicitly return true
                  }}
                  className="p-mr-2 p-mb-2"
                />
              ))}
            </div>
          </ScrollPanel>
        )}
        {selectedArtworksMap.size > 0 && (
          <div className="p-mt-4 p-text-right">
            <button
              className="p-button p-button-secondary p-button-sm"
              onClick={() => setSelectedArtworksMap(new Map())}
            >
              Clear All Selections
            </button>
          </div>
        )}
      </div>

      {/* DataTable Component */}
      <div className="card p-4 w-full max-w-screen-lg surface-card shadow-2 border-round">
        {loading ? (
          <p>Loading artworks...</p>
        ) : error ? (
          <p className="p-error">{error}</p>
        ) : (
          <DataTable
            value={artworks}
            paginator
            rows={rowsPerPage}
            totalRecords={totalRecords}
            first={(currentPage - 1) * rowsPerPage}
            onPage={onPageChange}
            lazy
            selectionMode="multiple"
            selection={selectedRowsOnCurrentPage}
            onSelectionChange={(e) => handleSelectionChange(e.value as Artwork[])}
            dataKey="id"
            emptyMessage="No artworks found."
            scrollable
            scrollHeight="400px"
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
            <Column field="title" header="Title" sortable></Column>
            <Column field="place_of_origin" header="Place of Origin" sortable></Column>
            <Column field="artist_display" header="Artist" sortable></Column>
            <Column field="inscriptions" header="Inscriptions" body={(rowData: Artwork) => rowData.inscriptions || 'N/A'}></Column>
            <Column field="date_start" header="Start Date" sortable></Column>
            <Column field="date_end" header="End Date" sortable></Column>
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default App;