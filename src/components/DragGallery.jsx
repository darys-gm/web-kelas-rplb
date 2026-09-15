import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  wrap,
} from "framer-motion";
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import { cn } from "../lib/utils";

// ============================================
// 1. CONSTANTS & VARIANT DEFINITIONS
// ============================================
const VARIANTS = {
  DEFAULT: "default",
  MASONRY: "masonry",
  POLAROID: "polaroid"
};

// ============================================
// 2. CONTEXT
// ============================================
const GridVariantContext = createContext(VARIANTS.DEFAULT);

// ============================================
// 3. MOTION VARIANTS
// ============================================
const rowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: () => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() + 1.5,
      duration: 1.4,
      ease: cubicBezier(0.18, 0.71, 0.11, 1),
    },
  }),
};

// ============================================
// 4. STYLE MAPPINGS
// ============================================
const gridItemStylesMap = {
  default: "rounded-sm",
  masonry: "even:mt-[60%] rounded-sm",
  polaroid: "border-10 border-b-28 border-white shadow-xl even:rotate-3 odd:-rotate-2 hover:rotate-0 transition-transform ease-out duration-300 even:mt-[60%]",
};

const gridBodyStylesMap = {
  default: "gap-14 p-7 md:gap-28 md:p-14",
  masonry: "gap-x-14 px-7 md:gap-x-28 md:px-14",
  polaroid: "gap-x-14 px-7 md:gap-x-28 md:px-14",
};

// ============================================
// 5. DRAGGABLE CONTAINER COMPONENT
// ============================================
export const DraggableContainer = ({
  className = "",
  children,
  variant = VARIANTS.DEFAULT,
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isDragging, setIsDragging] = useState(false);

  const handleIsDragging = () => setIsDragging(true);
  const handleIsNotDragging = () => setIsDragging(false);

  useEffect(() => {
    const container = ref.current?.getBoundingClientRect();
    if (!container) return;

    const { width, height } = container;

    const xDrag = x.on("change", (latest) => {
      const wrappedX = wrap(-(width / 2), 0, latest);
      x.set(wrappedX);
    });

    const yDrag = y.on("change", (latest) => {
      const wrappedY = wrap(-(height / 2), 0, latest);
      y.set(wrappedY);
    });

    const handleWheelScroll = (event) => {
      if (!isDragging) {
        animate(y, y.get() - event.deltaY * 2.7, {
          type: "tween",
          duration: 1.2,
          ease: cubicBezier(0.18, 0.71, 0.11, 1),
        });
      }
    };

    window.addEventListener("wheel", handleWheelScroll);
    return () => {
      xDrag();
      yDrag();
      window.removeEventListener("wheel", handleWheelScroll);
    };
  }, [x, y, isDragging]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div className="h-[600px] overflow-hidden rounded-xl">
        <motion.div className="h-[600px] overflow-hidden">
          <motion.div
            className={cn(
              "grid h-fit w-fit cursor-grab grid-cols-[repeat(2,1fr)] bg-gradient-to-br from-primary/5 via-surface-container/10 to-secondary/5 active:cursor-grabbing will-change-transform",
              className
            )}
            drag
            dragMomentum={true}
            dragTransition={{
              timeConstant: 200,
              power: 0.28,
              restDelta: 0,
              bounceStiffness: 0,
            }}
            onMouseDown={handleIsDragging}
            onMouseUp={handleIsNotDragging}
            onMouseLeave={handleIsNotDragging}
            style={{ x, y }}
            ref={ref}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  );
};

// ============================================
// 6. GRID ITEM COMPONENT
// ============================================
export const GridItem = ({ children, className = "" }) => {
  const variant = useContext(GridVariantContext);

  return (
    <motion.div
      className={cn(
        "overflow-hidden hover:cursor-pointer w-full h-full will-change-transform",
        variant ? gridItemStylesMap[variant] : gridItemStylesMap.default,
        className
      )}
      variants={rowVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

// ============================================
// 7. GRID BODY COMPONENT
// ============================================
export const GridBody = memo(({ children, className = "" }) => {
  const variant = useContext(GridVariantContext);

  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "grid grid-cols-[repeat(6,1fr)] h-fit w-fit",
            variant ? gridBodyStylesMap[variant] : gridBodyStylesMap.default,
            className
          )}
        >
          {children}
        </div>
      ))}
    </>
  );
});

GridBody.displayName = "GridBody";

// ============================================
// 8. EXPORT DEFAULT (Optional)
// ============================================
export default {
  DraggableContainer,
  GridItem,
  GridBody,
};