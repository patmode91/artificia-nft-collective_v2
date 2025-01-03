import { useQuery } from '@tanstack/react-query';
import { queries } from '@/lib/query';
import { useAuth } from '@/lib/auth';
import { NFTCard } from './NFTCard';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';

export function NFTGrid() {
  const { user } = useAuth();
  const { data: nfts, isLoading } = useQuery(
    queries.nft.userNFTs.queryKey(user?.id || ''),
    queries.nft.userNFTs.queryFn,
    {
      enabled: !!user,
    },
  );

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (!nfts?.length) {
    return (
      <Card className="flex items-center justify-center h-48 text-muted-foreground">
        No NFTs found
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          tokenId={nft.token_id}
          name={nft.title}
          description={nft.description || ''}
          imageUrl={nft.image_url}
          contractAddress={nft.contract_address || ''}
          metadata={nft.metadata || {}}
        />
      </div>
    </div>
  );
}
