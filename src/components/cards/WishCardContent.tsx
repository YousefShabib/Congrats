import { Pin, User } from 'lucide-react'
import type { Congratulation } from '@/types'
import { cn } from '@/utils/cn'

interface WishCardContentProps {
  wish: Congratulation
  /** Max chars for message preview; null = full text */
  messagePreview?: number | null
  imageSize?: 'orbit' | 'wall'
  isNew?: boolean
}

export function WishCardContent({
  wish,
  messagePreview = 80,
  imageSize = 'orbit',
  isNew = false,
}: WishCardContentProps) {
  const hasImage = Boolean(wish.avatar)
  const message =
    messagePreview === null
      ? wish.message
      : wish.message.length > messagePreview
        ? `${wish.message.slice(0, messagePreview)}...`
        : wish.message

  return (
    <>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/30">
          <span className="text-sm font-bold text-luxury-gold-dark">
            {wish.senderName.charAt(0) ? (
              wish.senderName.charAt(0)
            ) : (
              <User className="h-4 w-4" />
            )}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {wish.isPinned && <Pin className="h-3.5 w-3.5 shrink-0 text-luxury-gold-dark" />}
            <p className="truncate text-sm font-semibold text-charcoal">{wish.senderName}</p>
            {isNew && (
              <span className="rounded-full bg-luxury-gold/20 px-2 py-0.5 text-[10px] text-luxury-gold-dark">
                جديد
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted">
            {wish.createdAt.toLocaleDateString('ar-SA')}
          </p>
        </div>
      </div>

      <p
        className={cn(
          'leading-relaxed text-charcoal/85',
          imageSize === 'wall' ? 'text-sm' : 'text-xs',
        )}
      >
        {message}
      </p>

      {hasImage && (
        <div
          className={cn(
            'mt-3 overflow-hidden rounded-xl ring-1 ring-luxury-gold/15',
            imageSize === 'wall' ? 'max-h-72' : 'max-h-44',
          )}
        >
          <img
            src={wish.avatar}
            alt={`صورة من ${wish.senderName}`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </>
  )
}
