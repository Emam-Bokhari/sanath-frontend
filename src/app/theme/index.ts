
export const mainTheme = {
    token: { 
        controlHeight: 40, 
        colorPrimary: "#1a3c6e", // Professional dark blue
        borderRadius: 8,
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
        colorBgLayout: "#f8fafc",
    },
    components: {
        Button: {
            controlHeight: 40,
            borderRadius: 8,
            fontWeight: 600,
        },
        Input: {
            borderRadius: 8,
            colorBorder: "#e2e8f0",
            colorPrimaryBg: "#ffffff",
            colorText: "#1e293b",
            fontSize: 14,
            colorTextPlaceholder: "#94a3b8",
        },
        Modal: {
            colorIcon: "#64748b",
            colorBgMask: "rgba(15, 23, 42, 0.5)",
            headerBg: "#ffffff",
            titleColor: "#1e293b",
            titleFontSize: 18,
            borderRadiusLG: 16,
        },
        Menu: {
            itemSelectedBg: "rgba(26, 60, 110, 0.08)",
            itemSelectedColor: "#1a3c6e",
            itemHoverColor: "#1a3c6e",
            itemHoverBg: "rgba(26, 60, 110, 0.04)",
            borderRadius: 8,
            itemMarginInline: 8,
            itemHeight: 44,
        },
        Table: {
            colorBgContainer: "#ffffff",
            borderColor: "#f1f5f9",
            headerBg: "#f8fafc",
            colorText: "#334155",
            headerColor: "#475569",
            headerSplitColor: "transparent",
            borderRadius: 12,
        },
        Card: {
            borderRadiusLG: 16,
            colorBorderSecondary: "#f1f5f9",
            boxShadowTertiary: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
        Tag: {
            borderRadiusSM: 6,
        },
        Select: {
            borderRadius: 8,
            colorBorder: "#e2e8f0",
        }
    },
};
