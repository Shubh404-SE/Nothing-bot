export interface TranslationStateRepository {
  tryAcquireReactionDedupeLock(key: string, ttlSec: number): Promise<boolean>;
  tryAcquireSlashDedupeLock(key: string, ttlSec: number): Promise<boolean>;
  isOnCooldown(key: string): Promise<boolean>;
  setCooldown(key: string, ttlSec: number): Promise<void>;
}
